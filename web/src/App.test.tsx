import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import type { Question } from './questions'

// Test data only; these are not approved Croatian content.
const testBank: readonly Question[] = [
  {
    id: 'test-1',
    prompt: 'Testno pitanje 1',
    options: ['Odgovor 1A', 'Odgovor 1B'],
    correctIndex: 0,
    explanation: 'Objašnjenje 1.',
    status: 'approved',
    authoringFile: 'test',
    approvalUrl: 'test',
  },
  {
    id: 'test-2',
    prompt: 'Testno pitanje 2',
    options: ['Odgovor 2A', 'Odgovor 2B'],
    correctIndex: 1,
    explanation: 'Objašnjenje 2.',
    status: 'approved',
    authoringFile: 'test',
    approvalUrl: 'test',
  },
]

// A random value just below 1 keeps the original order; 0 reverses two items.
const keepOrder = () => 0.99
const reverseOrder = () => 0

function renderApp(random = keepOrder) {
  return render(<App questionBank={testBank} random={random} />)
}

describe('flash cards', () => {
  it('shows the first question and waits for an answer', () => {
    renderApp()

    expect(screen.getByRole('complementary', { name: 'Napomena o sadržaju' })).toHaveTextContent(
      /Sva pravopisna pitanja prošla su ljudsku provjeru\./,
    )
    expect(screen.getByText('Pitanje 1 od 2')).toBeVisible()
    expect(screen.getByText('Odobreno pravopisno pitanje')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Testno pitanje 1' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Odgovor 1A' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Odgovor 1B' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: /Sljedeće pitanje/ })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
    expect(screen.getByRole('progressbar')).toHaveAttribute('max', '2')
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Napredak kroz pitanja')
  })

  it('presents the questions in the order given by the shuffle', () => {
    renderApp(reverseOrder)

    expect(screen.getByRole('heading', { name: 'Testno pitanje 2' })).toBeVisible()
  })

  it('explains a wrong answer, locks both choices, and excludes it from the score', async () => {
    const user = userEvent.setup()
    renderApp()
    await user.click(screen.getByRole('button', { name: 'Odgovor 1B' }))

    expect(screen.getByRole('status')).toHaveTextContent('Ovaj put nije točno.')
    expect(screen.getByRole('status')).toHaveTextContent('Objašnjenje 1.')
    expect(screen.getByRole('button', { name: /Odgovor 1A/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Odgovor 1B/ })).toBeDisabled()
    expect(screen.getByText('✓ Točan odgovor')).toBeVisible()
    expect(screen.getByText('× Tvoj odabir')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    expect(screen.getByText('Pitanje 2 od 2')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Odgovor 2B' }))
    await user.click(screen.getByRole('button', { name: /Pogledaj rezultat/ }))

    expect(screen.getByRole('heading', { name: 'Sve je riješeno!' })).toHaveFocus()
    expect(screen.getByText('1 / 2')).toBeVisible()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '2')
  })

  it('starts a clean session with a new order after restart', async () => {
    const user = userEvent.setup()
    const orders = [keepOrder, reverseOrder]
    renderApp(() => orders.shift()?.() ?? 0)

    await user.click(screen.getByRole('button', { name: 'Odgovor 1A' }))
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    await user.click(screen.getByRole('button', { name: 'Odgovor 2B' }))
    await user.click(screen.getByRole('button', { name: /Pogledaj rezultat/ }))
    expect(screen.getByText('2 / 2')).toBeVisible()
    await user.click(screen.getByRole('button', { name: /Pokreni ponovno/ }))

    expect(screen.getByText('Pitanje 1 od 2')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Testno pitanje 2' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Odgovor 2A' })).toBeEnabled()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
  })

  it('supports keyboard answers and progression with managed focus', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Odgovor 1A' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /Sljedeće pitanje/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Testno pitanje 2' })).toHaveFocus()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Odgovor 2B' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('status')).toHaveTextContent('Točno!')
    expect(screen.getByRole('button', { name: /Pogledaj rezultat/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Sve je riješeno!' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: /Pokreni ponovno/ })).toHaveFocus()
  })
})
