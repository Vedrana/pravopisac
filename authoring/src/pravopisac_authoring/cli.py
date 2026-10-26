import argparse
import sys
from pathlib import Path
from typing import TypeVar

from pydantic import ValidationError

from .client import AuthoringError, ChatClient
from .models import Artifact, Brief, Comparison, Document, HumanReview
from .pipeline import digest, record_review, run_pilot, verify_review

T = TypeVar("T", bound=Document)


def read_document(path: Path, model: type[T]) -> T:
    return model.model_validate_json(path.read_text(encoding="utf-8"))


def check_output(path: Path) -> None:
    if path.exists() or path.is_symlink():
        raise AuthoringError(f"Refusing to overwrite existing output: {path}")
    if not path.parent.is_dir():
        raise AuthoringError(f"Output directory does not exist: {path.parent}")


def write_document(path: Path, document: Document) -> None:
    with path.open("x", encoding="utf-8") as output:
        output.write(document.model_dump_json(indent=2, by_alias=True) + "\n")


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Local, unreviewed question authoring")
    commands = parser.add_subparsers(dest="command", required=True)
    draft = commands.add_parser("draft", help="Make one draft and one advisory critique")
    draft.add_argument("--brief", type=Path, required=True)
    draft.add_argument("--comparison", type=Path, required=True)
    draft.add_argument("--output", type=Path, required=True)

    review = commands.add_parser("review", help="Record an explicit human decision")
    review.add_argument("--artifact", type=Path, required=True)
    review.add_argument("--reviewer", required=True)
    review.add_argument(
        "--decision", choices=("approved", "rejected", "changes_requested"),
        required=True,
    )
    review.add_argument("--note", required=True)
    review.add_argument("--human-reviewed", action="store_true", required=True)
    review.add_argument("--output", type=Path, required=True)

    verify = commands.add_parser("verify-review", help="Check approval of this revision")
    verify.add_argument("--artifact", type=Path, required=True)
    verify.add_argument("--review", type=Path, required=True)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = make_parser().parse_args(argv)
    try:
        if args.command == "draft":
            brief = read_document(args.brief, Brief)
            comparison = read_document(args.comparison, Comparison)
            check_output(args.output)
            artifact = run_pilot(brief, comparison, ChatClient.from_env())
            write_document(args.output, artifact)
            print(f"Unreviewed artifact: {args.output}")
            print(f"Revision: {digest(artifact)}")
            print("Structural/source checks passed; linguistic correctness is unproven.")
            print("No question was approved or imported into the app.")
        elif args.command == "review":
            artifact = read_document(args.artifact, Artifact)
            check_output(args.output)
            review = record_review(
                artifact,
                reviewer_id=args.reviewer,
                decision=args.decision,
                note=args.note,
                human_reviewed=args.human_reviewed,
            )
            write_document(args.output, review)
            print(f"Recorded human decision: {review.decision}")
            print(f"Review record: {args.output}")
        else:
            artifact = read_document(args.artifact, Artifact)
            review = read_document(args.review, HumanReview)
            verify_review(artifact, review)
            print("Human approval matches this artifact revision; nothing was exported.")
        return 0
    except ValidationError as error:
        details = "; ".join(
            f"{'.'.join(map(str, item['loc'])) or 'document'}: {item['msg']}"
            for item in error.errors(include_input=False, include_url=False)
        )
        print(f"Validation failed: {details}", file=sys.stderr)
        return 1
    except (AuthoringError, ValueError, OSError, UnicodeError) as error:
        print(f"Authoring failed: {error}", file=sys.stderr)
        return 1
