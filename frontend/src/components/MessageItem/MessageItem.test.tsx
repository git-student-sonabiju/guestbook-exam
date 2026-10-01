import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Message } from '../../types'
import { MessageItem } from './MessageItem'

const message: Message = {
  id: 1,
  name: 'Alice',
  text: 'Hello',
  createdAt: '2026-10-01T10:00:00Z',
  updatedAt: null,
}

function renderItem(overrides: Partial<Message> = {}) {
  const onSave = vi.fn().mockResolvedValue(true)
  const onDelete = vi.fn().mockResolvedValue(true)
  render(
    <ul>
      <MessageItem message={{ ...message, ...overrides }} onSave={onSave} onDelete={onDelete} />
    </ul>,
  )
  return { onSave, onDelete }
}

describe('MessageItem', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows name, text and date without the edited label for an unedited message', () => {
    renderItem()

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText(new Date(message.createdAt).toLocaleString())).toBeInTheDocument()
    expect(screen.queryByText('(edited)')).not.toBeInTheDocument()
  })

  it('shows the edited label when the message has been updated', () => {
    renderItem({ updatedAt: '2026-10-01T11:00:00Z' })

    expect(screen.getByText('(edited)')).toBeInTheDocument()
  })

  it('turns the text into an input and saves the new text', async () => {
    const { onSave } = renderItem()

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    const input = screen.getByLabelText('Edit message')
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledWith(1, 'Updated')
    expect(screen.queryByLabelText('Edit message')).not.toBeInTheDocument()
  })

  it('stays in edit mode when saving fails', async () => {
    const { onSave } = renderItem()
    onSave.mockResolvedValue(false)

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByLabelText('Edit message')).toBeInTheDocument()
  })

  it('discards the edit on cancel', async () => {
    const { onSave } = renderItem()

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.type(screen.getByLabelText('Edit message'), ' changed')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onSave).not.toHaveBeenCalled()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('does not save blank text', async () => {
    const { onSave } = renderItem()

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.clear(screen.getByLabelText('Edit message'))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Text is required')
    expect(onSave).not.toHaveBeenCalled()
  })

  it('deletes after the user confirms', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { onDelete } = renderItem()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(window.confirm).toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('does not delete when the user cancels the confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const { onDelete } = renderItem()

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(onDelete).not.toHaveBeenCalled()
  })
})
