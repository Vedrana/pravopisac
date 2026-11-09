/// <reference types="node" />

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { questions } from './questions'

describe('question data', () => {
  it('copies the approved question exactly and retains its recorded approval', () => {
    const question = questions[0]
    const approvedQuestionFile = readFileSync(
      resolve(dirname(fileURLToPath(import.meta.url)), '../..', question.authoringFile),
      'utf8',
    )

    expect(questions.filter((item) => item.status === 'approved')).toHaveLength(1)
    expect(question.status).toBe('approved')
    expect(question.authoringFile).toBe('authoring/questions/personal-name-question-1.md')
    expect(question.approvalUrl).toBe(
      'https://github.com/Vedrana/pravopisac/pull/6#pullrequestreview-5766943407',
    )
    expect(approvedQuestionFile).toContain('# Approved question\n')
    expect(approvedQuestionFile).toContain(question.approvalUrl)
    expect(approvedQuestionFile).toContain(
      [
        '```text',
        `ID: ${question.id}`,
        '',
        question.prompt,
        '',
        `A: ${question.options[0]}`,
        `B: ${question.options[1]}`,
        '',
        `Correct answer: ${question.correctIndex === 0 ? 'A' : 'B'}`,
        '',
        `Explanation: ${question.explanation}`,
        '```',
      ].join('\n'),
    )
  })

  it('contains only approved questions and keeps all question IDs unique', () => {
    expect(questions).toHaveLength(1)
    expect(questions.every((question) => question.status === 'approved')).toBe(true)
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length)
  })
})
