/// <reference types="node" />

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { questions } from './questions'
import { shuffle } from './shuffle'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const authoringFiles = readdirSync(resolve(repoRoot, 'authoring/questions'))
  .filter((name) => name.endsWith('.md') && name !== 'README.md')
  .sort()

describe('question data', () => {
  it('includes every tracked authoring question exactly once, all approved', () => {
    expect(questions.map((question) => question.authoringFile).sort()).toEqual(
      authoringFiles.map((name) => `authoring/questions/${name}`),
    )
    expect(questions.every((question) => question.status === 'approved')).toBe(true)
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length)
  })

  it('copies each question exactly from its file and retains its approval link', () => {
    for (const question of questions) {
      const file = readFileSync(resolve(repoRoot, question.authoringFile), 'utf8')

      expect(file).toContain(question.approvalUrl)
      expect(file).toContain(
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
    }
  })
})

describe('shuffle', () => {
  it('returns a permutation without changing the input', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffle(input, () => 0)

    expect(input).toEqual([1, 2, 3, 4, 5])
    expect([...result].sort()).toEqual(input)
    expect(result).not.toEqual(input)
  })
})
