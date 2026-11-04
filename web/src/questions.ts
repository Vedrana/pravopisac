export type AnswerIndex = 0 | 1

export type Question = {
  id: string
  prompt: string
  options: readonly [string, string]
  correctIndex: AnswerIndex
  explanation: string
} & (
  | {
      status: 'approved'
      authoringFile: string
      approvalUrl: string
    }
  | { status: 'demo' }
)

export const demoQuestions = [
  {
    id: 'demo-1',
    status: 'demo',
    prompt: 'U ovom primjeru odaberi odgovor A.',
    options: ['Probni odgovor A', 'Probni odgovor B'],
    correctIndex: 0,
    explanation:
      'Odgovor A označen je kao točan samo radi demonstracije sučelja.',
  },
  {
    id: 'demo-2',
    status: 'demo',
    prompt: 'Sada odaberi odgovor B.',
    options: ['Probni odgovor A', 'Probni odgovor B'],
    correctIndex: 1,
    explanation:
      'Ovaj primjer pokazuje da točan odgovor ne mora uvijek biti na istom mjestu.',
  },
  {
    id: 'demo-3',
    status: 'demo',
    prompt: 'Za posljednji primjer ponovno odaberi odgovor B.',
    options: ['Probni odgovor A', 'Probni odgovor B'],
    correctIndex: 1,
    explanation:
      'Ovo je posljednja demo kartica. Nakon nje možeš pogledati rezultat ili krenuti ispočetka.',
  },
] as const satisfies readonly Question[]

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
  ...demoQuestions,
] as const satisfies readonly Question[]
