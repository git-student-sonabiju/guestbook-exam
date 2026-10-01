import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { ApiError, createMessage, deleteMessage, listMessages, updateMessage } from './api/messages'
import type { Message } from './types'

vi.mock('./api/messages', async (importOriginal) => {
  const original = await importOriginal<typeof import('./api/messages')>()
  return {
    ...original,
    listMessages: vi.fn(),
    createMessage: vi.fn(),
    updateMessage: vi.fn(),
    deleteMessage: vi.fn(),
  }
})

const existing: Message = {
  id: 1,
  name: 'Alice',
  text: 'First',
  createdAt: '2026-10-01T09:00:00Z',
  updatedAt: null,
}

describe('App', () => {
  beforeEach(() => {
    vi.mocked(listMessages).mockResolvedValue([existing])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('lists messages from the server', async () => {
    render(<App />)

    expect(await screen.findByText('First')).toBeInTheDocument()
  })

  it('shows an empty state when there are no messages', async () => {
    vi.mocked(listMessages).mockResolvedValue([])
    render(<App />)

    expect(await screen.findByText('No messages yet.')).toBeInTheDocument()
  })

  it('adds a posted message to the top of the list', async () => {
    vi.mocked(createMessage).mockResolvedValue({
      id: 2,
      name: 'Bob',
      text: 'Second',
      createdAt: '2026-10-01T10:00:00Z',
      updatedAt: null,
    })
    render(<App />)
    await screen.findByText('First')

    await userEvent.type(screen.getByLabelText('Name'), 'Bob')
    await userEvent.type(screen.getByLabelText('Message'), 'Second')
    await userEvent.click(screen.getByRole('button', { name: 'Post' }))

    const items = await screen.findAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(within(items[0]).getByText('Second')).toBeInTheDocument()
  })

  it('replaces an edited message and marks it as edited', async () => {
    vi.mocked(updateMessage).mockResolvedValue({ ...existing, text: 'Changed', updatedAt: '2026-10-01T11:00:00Z' })
    render(<App />)
    await screen.findByText('First')

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await userEvent.clear(screen.getByLabelText('Edit message'))
    await userEvent.type(screen.getByLabelText('Edit message'), 'Changed')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Changed')).toBeInTheDocument()
    expect(screen.getByText('(edited)')).toBeInTheDocument()
  })

  it('removes a deleted message after confirmation', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(deleteMessage).mockResolvedValue(undefined)
    render(<App />)
    await screen.findByText('First')

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('No messages yet.')).toBeInTheDocument()
  })

  it('shows the server error message when an action fails', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(deleteMessage).mockRejectedValue(new ApiError('Message 1 not found'))
    render(<App />)
    await screen.findByText('First')

    await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Message 1 not found')
    expect(screen.getByText('First')).toBeInTheDocument()
  })

  it('shows the server error message when loading fails', async () => {
    vi.mocked(listMessages).mockRejectedValue(new ApiError('Unexpected server error'))
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Unexpected server error')
  })
})
