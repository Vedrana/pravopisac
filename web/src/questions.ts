import { generatedQuestions } from './questions.generated'

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

// Generated from the human-approved files in authoring/questions by `npm run generate`.
export const questions: readonly Question[] = generatedQuestions
