import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('flash cards', () => {
  it('shows only the approved question and waits for an answer', () => {
    render(<App />)

    expect(screen.getByRole('complementary', { name: 'Napomena o sadržaju' })).toHaveTextContent(
      /Sva pravopisna pitanja prošla su ljudsku provjeru\./,
    )
    expect(screen.queryByText(/demo/i)).not.toBeInTheDocument()
    expect(screen.getByText('Pitanje 1 od 1')).toBeVisible()
    expect(screen.getByText('Odobreno pravopisno pitanje')).toBeVisible()
    expect(screen.queryByText('Demo kartica — probni podaci')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Koja je rečenica pravilno napisana?' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Danas Ana čita.' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Danas ana čita.' })).toBeEnabled()
    expect(screen.queryByRole('button', { name: /Sljedeće pitanje/ })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '0')
    expect(screen.getByRole('progressbar')).toHaveAttribute('max', '1')
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Napredak kroz pitanja')
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('explains a wrong answer, locks both choices, and excludes it from the score', async () => {
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
    await user.click(screen.getByRole('button', { name: /Pogledaj rezultat/ }))

    expect(screen.getByRole('heading', { name: 'Sve je riješeno!' })).toHaveFocus()
    expect(screen.getByText('0 / 1')).toBeVisible()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1')
  })

  it('derives the final score from recorded answers and starts a clean new session', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Danas Ana čita.' }))
    expect(screen.getByRole('status')).toHaveTextContent('Točno!')
    await user.click(screen.getByRole('button', { name: /Pogledaj rezultat/ }))

    expect(screen.getByRole('heading', { name: 'Sve je riješeno!' })).toHaveFocus()
    expect(screen.getByText('Rezultat uključuje samo odobrena pravopisna pitanja.')).toBeVisible()
    expect(screen.queryByText(/demo/i)).not.toBeInTheDocument()
    expect(screen.getByText('1 / 1')).toBeVisible()
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '1')
    await user.click(screen.getByRole('button', { name: /Pokreni ponovno/ }))

    expect(screen.getByText('Pitanje 1 od 1')).toBeVisible()
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
    expect(screen.getByRole('button', { name: /Pogledaj rezultat/ })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('heading', { name: 'Sve je riješeno!' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: /Pokreni ponovno/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Koja je rečenica pravilno napisana?' })).toHaveFocus()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Danas ana čita.' })).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('status')).toHaveTextContent('Ovaj put nije točno.')
    expect(screen.getByRole('button', { name: /Pogledaj rezultat/ })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('heading', { name: 'Sve je riješeno!' })).toHaveFocus()
  })
})
