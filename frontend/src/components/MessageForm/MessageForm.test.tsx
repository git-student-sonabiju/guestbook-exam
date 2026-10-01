import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessageForm } from './MessageForm'

describe('MessageForm', () => {
  it('posts the name and message and clears the fields on success', async () => {
    const onPost = vi.fn().mockResolvedValue(true)
    render(<MessageForm onPost={onPost} />)

    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText('Message'), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: 'Post' }))

    expect(onPost).toHaveBeenCalledWith('Alice', 'Hello')
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Message')).toHaveValue('')
  })

  it('keeps the fields when posting fails', async () => {
    const onPost = vi.fn().mockResolvedValue(false)
    render(<MessageForm onPost={onPost} />)

    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.type(screen.getByLabelText('Message'), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: 'Post' }))

    expect(screen.getByLabelText('Name')).toHaveValue('Alice')
    expect(screen.getByLabelText('Message')).toHaveValue('Hello')
  })

  it('shows a validation error and does not post when the name is blank', async () => {
    const onPost = vi.fn()
    render(<MessageForm onPost={onPost} />)

    await userEvent.type(screen.getByLabelText('Message'), 'Hello')
    await userEvent.click(screen.getByRole('button', { name: 'Post' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
    expect(onPost).not.toHaveBeenCalled()
  })

  it('shows a validation error when the message is over 200 characters', async () => {
    const onPost = vi.fn()
    render(<MessageForm onPost={onPost} />)

    await userEvent.type(screen.getByLabelText('Name'), 'Alice')
    await userEvent.click(screen.getByLabelText('Message'))
    await userEvent.paste('a'.repeat(201))
    await userEvent.click(screen.getByRole('button', { name: 'Post' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Text must be at most 200 characters')
    expect(onPost).not.toHaveBeenCalled()
  })
})
