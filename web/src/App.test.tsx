import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('flash cards', () => {
  it('shows the approved question first, explains the mixed content, and waits for an answer', () => {
    render(<App />)

    expect(screen.getByRole('complementary', { name: 'Napomena o sadržaju' })).toHaveTextContent(
      /Odobrena pravopisna pitanja prošla su ljudski pregled/,
    )
    expect(screen.getByRole('complementary', { name: 'Napomena o sadržaju' })).toHaveTextContent(
      /Demo kartice služe samo za isprobavanje aplikacije, a ne za učenje pravopisa/,
    )
    expect(screen.getByText('Pitanje 1 od 4')).toBeVisible()
    expect(screen.getByText('Odobreno pravopisno pitanje')).toBeVisible()
    expect(screen.queryByText('Demo kartica — probni podaci')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Koja je rečenica pravilno napisana?' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Danas Ana čita.' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Danas ana čita.' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: /Sljedeće pitanje/ })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
    expect(screen.getByRole('progressbar')).toHaveAttribute('max', '4')
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Napredak kroz pitanja')
  })

  it('shows an explanation for a wrong answer, locks both choices, and resets feedback on next', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Danas ana čita.' }))

    expect(screen.getByRole('status')).toHaveTextContent('Ovaj put nije točno.')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Ana je osobno ime pa počinje velikim slovom i kad nije na početku rečenice.',
    )
    expect(screen.getByRole('button', { name: /Danas Ana čita/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Danas ana čita/ })).toBeDisabled()
    expect(screen.getByText('✓ Točan odgovor')).toBeVisible()
    expect(screen.getByText('× Tvoj odabir')).toBeVisible()

    await user.click(screen.getByRole('button', { name: /Danas Ana čita/ }))
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))

    expect(screen.getByText('Pitanje 2 od 4')).toBeVisible()
    expect(screen.getByText('Demo kartica — probni podaci')).toBeVisible()
    expect(screen.queryByText('Odobreno pravopisno pitanje')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('button', { name: 'Probni odgovor A' })).toBeEnabled()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1')
    expect(screen.getByRole('heading', { name: 'U ovom primjeru odaberi odgovor A.' })).toHaveFocus()
  })

  it('preserves the demo answer and explanation without presenting it as reviewed content', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Danas Ana čita.' }))
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    await user.click(screen.getByRole('button', { name: 'Probni odgovor B' }))

    expect(screen.getByText('Demo kartica — probni podaci')).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('Ovaj put nije točno.')
    expect(screen.getByRole('status')).toHaveTextContent(
      'Odgovor A označen je kao točan samo radi demonstracije sučelja.',
    )
    expect(screen.getByRole('button', { name: /Probni odgovor A/ })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Probni odgovor B/ })).toBeDisabled()
  })

  it('derives the final score from recorded answers and starts a clean new session', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Danas Ana čita.' }))
    expect(screen.getByRole('status')).toHaveTextContent('Točno!')
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    await user.click(screen.getByRole('button', { name: 'Probni odgovor A' }))
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    await user.click(screen.getByRole('button', { name: 'Probni odgovor A' }))
    await user.click(screen.getByRole('button', { name: /Sljedeće pitanje/ }))
    await user.click(screen.getByRole('button', { name: 'Probni odgovor B' }))
    await user.click(screen.getByRole('button', { name: /Pogledaj rezultat/ }))

    expect(screen.getByRole('heading', { name: 'Sve je riješeno!' })).toHaveFocus()
    expect(screen.getByText('Rezultat uključuje odobrena pitanja i probne demo kartice.')).toBeVisible()
    expect(screen.getByText('3 / 4')).toBeVisible()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '4')
    await user.click(screen.getByRole('button', { name: /Pokreni ponovno/ }))

    expect(screen.getByText('Pitanje 1 od 4')).toBeVisible()
    expect(screen.getByText('Odobreno pravopisno pitanje')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Danas Ana čita.' })).toBeEnabled()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
  })

  it('supports keyboard answers and progression with managed focus', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Danas Ana čita.' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('button', { name: /Sljedeće pitanje/ })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('heading', { name: 'U ovom primjeru odaberi odgovor A.' })).toHaveFocus()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Probni odgovor B' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('status')).toHaveTextContent('Ovaj put nije točno.')
    expect(screen.getByRole('button', { name: /Sljedeće pitanje/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Sada odaberi odgovor B.' })).toHaveFocus()
  })
})
