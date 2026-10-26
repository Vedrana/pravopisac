import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('demo flash cards', () => {
  it('labels the demo content and waits for an answer before allowing progression', () => {
    render(<App />)

    expect(screen.getByText(/a ne pravopisni zadaci za učenje/)).toBeVisible()
    expect(screen.getByText('Pitanje 1 od 3')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Probni odgovor A' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Probni odgovor B' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: /Sljedeće pitanje/ })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
  })

  it('shows an explanation for a wrong answer, locks both choices, and resets feedback on next', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Probni odgovor B' }))

    expect(screen.getByRole('status')).toHaveTextContent('Ovaj put nije točno.')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Odgovor A označen je kao točan samo radi demonstracije sučelja.',
    )
    expect(screen.getByRole('button', { name: /Probni odgovor A/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Probni odgovor B/ })).toBeDisabled()
    expect(screen.getByText('✓ Točan odgovor')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /Probni odgovor A/ }))
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))

    expect(screen.getByText('Pitanje 2 od 3')).toBeVisible()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('button', { name: 'Probni odgovor A' })).toBeEnabled()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1')
    expect(screen.getByRole('heading', { name: 'Sada odaberi odgovor B.' })).toHaveFocus()
  })

  it('derives the final score from recorded answers and starts a clean new session', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Probni odgovor A' }))
    expect(screen.getByRole('status')).toHaveTextContent('Točno!')
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    await user.click(screen.getByRole('button', { name: 'Probni odgovor A' }))
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    await user.click(screen.getByRole('button', { name: 'Probni odgovor B' }))
    await user.click(screen.getByRole('button', { name: /Pogledaj rezultat/ }))

    expect(screen.getByRole('heading', { name: 'Demo je gotov!' })).toHaveFocus()
    expect(screen.getByText('2 / 3')).toBeVisible()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '3')
    await user.click(screen.getByRole('button', { name: /Pokreni ponovno/ }))

    expect(screen.getByText('Pitanje 1 od 3')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Probni odgovor A' })).toBeEnabled()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
  })

  it('supports keyboard answers and progression with managed focus', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Probni odgovor A' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /Sljedeće pitanje/ })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('heading', { name: 'Sada odaberi odgovor B.' })).toHaveFocus()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Probni odgovor B' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('status')).toHaveTextContent('Točno!')
  })
})
