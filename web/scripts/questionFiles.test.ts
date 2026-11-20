import { describe, expect, it } from 'vitest'
import { parseQuestionFile, parseQuestionFiles } from './questionFiles.ts'

const approval = 'https://github.com/Vedrana/pravopisac/pull/1#issuecomment-1'
const block = [
  '```text',
  'ID: test-01',
  '',
  'Pitanje?',
  '',
  'A: Prvi',
  'B: Drugi',
  '',
  'Correct answer: B',
  '',
  'Explanation: Zato.',
  '```',
].join('\n')

function file(header: string, review = '') {
  return `# Approved question\n\n${header}\n\n## Approved question\n\n${block}\n\n## Supplied rule brief\n\nOld [link](https://github.com/Vedrana/pravopisac/pull/9#x).\n${review}`
}

describe('parseQuestionFile', () => {
  it('reads the question and the approval link from the header', () => {
    expect(
      parseQuestionFile('a.md', file(`Approved by @Vedrana. [Approval record](${approval}).`)),
    ).toEqual({
      id: 'test-01',
      prompt: 'Pitanje?',
      options: ['Prvi', 'Drugi'],
      correctIndex: 1,
      explanation: 'Zato.',
      status: 'approved',
      authoringFile: 'a.md',
      approvalUrl: approval,
    })
  })

  it('reads the approval link from Human review, not from the rule brief', () => {
    const text = file('Drafted.', `\n## Human review\n\nApproved by @Vedrana in [LGTM](${approval}).\n`)

    expect(parseQuestionFile('a.md', text).approvalUrl).toBe(approval)
  })

  it('rejects a file without recorded human approval', () => {
    expect(() => parseQuestionFile('a.md', file('Drafted.'))).toThrow(/no recorded human approval/)
  })

  it('rejects a malformed question block', () => {
    const text = file(`Approved by @Vedrana. [Record](${approval})`).replace('Correct answer: B', 'Answer: B')

    expect(() => parseQuestionFile('a.md', text)).toThrow(/expected format/)
  })

  it('rejects duplicate IDs', () => {
    const text = file(`Approved by @Vedrana. [Record](${approval})`)

    expect(() =>
      parseQuestionFiles([
        { path: 'a.md', text },
        { path: 'b.md', text },
      ]),
    ).toThrow(/Duplicate question ID test-01/)
  })
})
