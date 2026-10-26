import { useEffect, useRef, useState } from 'react'
import { demoQuestions } from './questions'
import type { AnswerIndex } from './questions'

type QuizSession = {
  currentIndex: number
  answers: AnswerIndex[]
}

const optionIndices = [0, 1] as const
const questionCount = demoQuestions.length

export default function App() {
  const [session, setSession] = useState<QuizSession>({
    currentIndex: 0,
    answers: [],
  })
  const titleRef = useRef<HTMLHeadingElement>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const question = demoQuestions[session.currentIndex]
  const selectedAnswer = session.answers[session.currentIndex]
  const hasAnswered = selectedAnswer !== undefined
  const isComplete = session.currentIndex === questionCount
  const score = demoQuestions.filter(
    (item, index) => session.answers[index] === item.correctIndex,
  ).length

  useEffect(() => {
    titleRef.current?.focus()
  }, [session.currentIndex])

  useEffect(() => {
    if (hasAnswered) nextButtonRef.current?.focus()
  }, [hasAnswered])

  function answer(option: AnswerIndex) {
    setSession((previous) => {
      if (
        previous.currentIndex >= questionCount ||
        previous.answers[previous.currentIndex] !== undefined
      ) {
        return previous
      }
      return { ...previous, answers: [...previous.answers, option] }
    })
  }

  function nextQuestion() {
    setSession((previous) => {
      if (previous.answers[previous.currentIndex] === undefined) return previous
      return { ...previous, currentIndex: previous.currentIndex + 1 }
    })
  }

  function restart() {
    setSession({ currentIndex: 0, answers: [] })
  }

  if (!isComplete && question === undefined) {
    throw new Error('The quiz position does not match the question data.')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">P.</span>
          <div>
            <h1>Pravopisac</h1>
            <p>Mali koraci do sigurnijeg pisanja.</p>
          </div>
        </div>
        <span className="demo-badge">Demo</span>
      </header>

      <main>
        <aside className="demo-notice" aria-label="Napomena o demo sadržaju">
          <span className="notice-icon" aria-hidden="true">i</span>
          <p>
            <strong>Isprobaj kako aplikacija radi.</strong> Ovo su probni podaci,
            a ne pravopisni zadaci za učenje.
          </p>
        </aside>

        <div className="progress-label">
          <span>Demo kartice</span>
          <span>{session.answers.length} / {questionCount} riješeno</span>
        </div>
        <progress
          className="quiz-progress"
          aria-label="Napredak kroz demo pitanja"
          max={questionCount}
          value={session.answers.length}
        />

        <section className="question-card" aria-labelledby="question-title">
          {isComplete ? (
            <div className="completion">
              <span className="completion-mark" aria-hidden="true">✓</span>
              <p className="eyebrow">Sve kartice su riješene</p>
              <h2 id="question-title" ref={titleRef} tabIndex={-1}>
                Demo je gotov!
              </h2>
              <p className="completion-copy">
                Svaka kartica ima pitanje, odgovor i objašnjenje.
              </p>
              <div className="score">
                <span>Točni demo odgovori</span>
                <strong>{score} / {questionCount}</strong>
              </div>
              <button className="primary-button" onClick={restart}>
                Pokreni ponovno <span aria-hidden="true">↻</span>
              </button>
            </div>
          ) : question ? (
            <>
              <div className="card-heading">
                <p className="eyebrow">
                  Pitanje {session.currentIndex + 1} od {questionCount}
                </p>
                <span className="card-number" aria-hidden="true">
                  {String(session.currentIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <h2 id="question-title" ref={titleRef} tabIndex={-1}>
                {question.prompt}
              </h2>
              <p className="question-hint">Odaberi jedan od dva odgovora.</p>
              <fieldset className="answer-options" disabled={hasAnswered}>
                <legend className="sr-only">Odgovori na pitanje</legend>
                {optionIndices.map((index) => {
                  const isCorrect = hasAnswered && index === question.correctIndex
                  const isWrong =
                    hasAnswered && index === selectedAnswer && !isCorrect

                  return (
                    <button
                      key={`${question.id}-${index}`}
                      type="button"
                      className={`answer-option${isCorrect ? ' is-correct' : ''}${isWrong ? ' is-wrong' : ''}`}
                      onClick={() => answer(index)}
                    >
                      <span className="option-letter" aria-hidden="true">
                        {index === 0 ? 'A' : 'B'}
                      </span>
                      <span className="option-copy">
                        <span>{question.options[index]}</span>
                        {isCorrect && <small>✓ Točan odgovor</small>}
                        {isWrong && <small>× Tvoj odabir</small>}
                      </span>
                    </button>
                  )
                })}
              </fieldset>
              <div
                className={`feedback${hasAnswered ? ' is-visible' : ''}`}
                role="status"
                aria-atomic="true"
              >
                {hasAnswered && (
                  <>
                    <strong>
                      {selectedAnswer === question.correctIndex
                        ? 'Točno!'
                        : 'Ovaj put nije točno.'}
                    </strong>
                    <p>{question.explanation}</p>
                  </>
                )}
              </div>
              {hasAnswered && (
                <button
                  className="primary-button next-button"
                  onClick={nextQuestion}
                  ref={nextButtonRef}
                >
                  {session.currentIndex === questionCount - 1
                    ? 'Pogledaj rezultat'
                    : 'Sljedeće pitanje'}
                  <span aria-hidden="true">→</span>
                </button>
              )}
            </>
          ) : null}
        </section>
        <p className="session-note">
          Bez prijave. Napredak se ne sprema nakon osvježavanja stranice.
        </p>
      </main>
      <footer className="site-footer">
        Prvo mala kartica. Kasnije velika pustolovina.
      </footer>
    </div>
  )
}
