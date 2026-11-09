export type AnswerIndex = 0 | 1

export type Question = {
  id: string
  prompt: string
  options: readonly [string, string]
  correctIndex: AnswerIndex
  explanation: string
  status: 'approved'
  authoringFile: string
  approvalUrl: string
}

export const questions = [
  {
    id: 'osobno-ime-ana-01',
    status: 'approved',
    authoringFile: 'authoring/questions/personal-name-question-1.md',
    approvalUrl:
      'https://github.com/Vedrana/pravopisac/pull/6#pullrequestreview-5766943407',
    prompt: 'Koja je rečenica pravilno napisana?',
    options: ['Danas Ana čita.', 'Danas ana čita.'],
    correctIndex: 0,
    explanation:
      'Ana je osobno ime pa počinje velikim slovom i kad nije na početku rečenice.',
  },
] as const satisfies readonly Question[]
