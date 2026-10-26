"""Explicit provider boundary for the local pilot's two model calls.

Transport failures stop the run without retries or provider-detail disclosure;
response content still needs the pipeline's domain and evidence validation.
"""

import json
import os
from dataclasses import dataclass
from http.client import HTTPException
from typing import Literal
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

from pydantic import BaseModel, ConfigDict, Field

from .models import ModelCall, Text


class AuthoringError(Exception):
    """Operator-facing workflow or provider failure handled by the CLI."""

    pass


@dataclass(frozen=True)
class Completion:
    """Raw model text paired with requested and provider-reported call provenance."""

    content: str
    provenance: ModelCall


# Provider message envelope; refusal and usable-content checks happen after parsing.
class _Message(BaseModel):
    model_config = ConfigDict(strict=True)
    content: str | None = None
    refusal: str | None = None


# Only a normally completed choice is acceptable; truncated/tool responses fail.
class _Choice(BaseModel):
    model_config = ConfigDict(strict=True)
    finish_reason: Literal["stop"]
    message: _Message


# Require one completed choice plus identifiers needed for the artifact's provenance.
class _Response(BaseModel):
    model_config = ConfigDict(strict=True)
    id: Text
    model: Text
    choices: tuple[_Choice, ...] = Field(min_length=1, max_length=1)


class _NoRedirects(HTTPRedirectHandler):
    """Prevent forwarding an authenticated request to a redirect destination."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        """Decline redirects so urllib surfaces them as HTTP failures."""
        return None


class ChatClient:
    """An explicit HTTPS Chat Completions endpoint; no SDK, retries, or tools."""

    def __init__(
        self, endpoint: str, api_key: str, generator_model: str, critic_model: str
    ):
        """Validate explicit HTTPS settings and disable redirects before any call."""
        parsed = urlsplit(endpoint)
        if (
            parsed.scheme != "https"
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
            or parsed.query
            or parsed.fragment
        ):
            raise AuthoringError(
                "The API URL must be HTTPS without credentials, query, or fragment."
            )
        if not all(value.strip() for value in (api_key, generator_model, critic_model)):
            raise AuthoringError("API key and both model names must be nonempty.")
        self.endpoint = endpoint
        self.api_key = api_key
        self.generator_model = generator_model
        self.critic_model = critic_model
        self.opener = build_opener(_NoRedirects())

    @classmethod
    def from_env(cls) -> "ChatClient":
        """Require all four provider settings, without defaults or secret logging."""
        names = (
            "PRAVOPISAC_API_URL",
            "PRAVOPISAC_API_KEY",
            "PRAVOPISAC_GENERATOR_MODEL",
            "PRAVOPISAC_CRITIC_MODEL",
        )
        values = [os.environ.get(name, "").strip() for name in names]
        missing = [name for name, value in zip(names, values) if not value]
        if missing:
            raise AuthoringError("Missing environment settings: " + ", ".join(missing))
        return cls(*values)

    def complete(self, *, model: str, system: str, user: str) -> Completion:
        """Send one JSON-object request with a 60-second timeout and no retry.

        Transport errors, refusals, and empty content raise AuthoringError;
        malformed or incomplete response envelopes raise Pydantic validation errors.
        Domain JSON validation belongs to the pipeline, not this transport.
        """
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "response_format": {"type": "json_object"},
        }
        request = Request(
            self.endpoint,
            data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            },
            method="POST",
        )
        try:
            with self.opener.open(request, timeout=60) as response:
                body = response.read()
        except HTTPError as error:
            raise AuthoringError(
                f"Model endpoint returned HTTP {error.code}; no retry was made."
            ) from error
        except (URLError, TimeoutError, HTTPException) as error:
            raise AuthoringError(
                "Model endpoint request failed; no retry was made."
            ) from error
        result = _Response.model_validate_json(body)
        message = result.choices[0].message
        if message.refusal:
            raise AuthoringError("The model refused the request.")
        if message.content is None or not message.content.strip():
            raise AuthoringError("The model returned no content.")
        return Completion(
            message.content,
            ModelCall(
                requested_model=model,
                returned_model=result.model,
                response_id=result.id,
            ),
        )
