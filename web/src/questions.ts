export type AnswerIndex = 0 | 1

export type Question = {
  id: string
  prompt: string
  options: readonly [string, string]
  correctIndex: AnswerIndex
  explanation: string
}

export const demoQuestions = [
  {
    id: 'demo-1',
    prompt: 'U ovom primjeru odaberi odgovor A.',
    options: ['Probni odgovor A', 'Probni odgovor B'],
    correctIndex: 0,
    explanation:
      'Odgovor A označen je kao točan samo radi demonstracije sučelja.',
  },
  {
    id: 'demo-2',
    prompt: 'Sada odaberi odgovor B.',
    options: ['Probni odgovor A', 'Probni odgovor B'],
    correctIndex: 1,
    explanation:
      'Ovaj primjer pokazuje da točan odgovor ne mora uvijek biti na istom mjestu.',
  },
  {
    id: 'demo-3',
    prompt: 'Za posljednji primjer ponovno odaberi odgovor B.',
    options: ['Probni odgovor A', 'Probni odgovor B'],
    correctIndex: 1,
    explanation:
      'Ovo je posljednja demo kartica. Nakon nje možeš pogledati rezultat ili krenuti ispočetka.',
  },
] as const satisfies readonly Question[]
