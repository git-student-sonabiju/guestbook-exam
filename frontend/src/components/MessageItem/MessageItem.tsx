import { useState } from 'react'
import type { Message } from '../../types'
import { formatDate, validateText } from '../../utils/validation'

interface MessageItemProps {
  message: Message
  onSave: (id: number, text: string) => Promise<boolean>
  onDelete: (id: number) => Promise<boolean>
}

export function MessageItem({ message, onSave, onDelete }: MessageItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.text)
  const [validationError, setValidationError] = useState<string | null>(null)

  function startEditing() {
    setDraft(message.text)
    setValidationError(null)
    setEditing(true)
  }

  async function handleSave() {
    const error = validateText(draft)
    setValidationError(error)
    if (error) {
      return
    }
    if (await onSave(message.id, draft)) {
      setEditing(false)
    }
  }

  async function handleDelete() {
    if (window.confirm('Delete this message?')) {
      await onDelete(message.id)
    }
  }

  return (
    <li className="card message">
      <div className="avatar" aria-hidden="true">
        {Array.from(message.name.trim())[0]?.toUpperCase() ?? '?'}
      </div>
      <div className="message-body">
        <header className="message-header">
          <strong className="message-name">{message.name}</strong>
          <time className="message-date" dateTime={message.createdAt}>
            {formatDate(message.createdAt)}
          </time>
          {message.updatedAt && <span className="badge">(edited)</span>}
        </header>
        {editing ? (
          <div className="edit-row">
            <input
              className="input"
              aria-label="Edit message"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="actions">
              <button className="btn btn-primary btn-small" type="button" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-ghost btn-small" type="button" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
            {validationError && (
              <p role="alert" className="inline-error">
                {validationError}
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="message-text">{message.text}</p>
            <div className="actions">
              <button className="btn btn-ghost btn-small" type="button" onClick={startEditing}>
                Edit
              </button>
              <button className="btn btn-danger btn-small" type="button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  )
}
