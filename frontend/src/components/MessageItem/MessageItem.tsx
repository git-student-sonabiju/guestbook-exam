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
    <li>
      <strong>{message.name}</strong> <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
      {message.updatedAt && <span> (edited)</span>}
      {editing ? (
        <div>
          <input aria-label="Edit message" value={draft} onChange={(event) => setDraft(event.target.value)} />
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
          {validationError && <p role="alert">{validationError}</p>}
        </div>
      ) : (
        <div>
          <p>{message.text}</p>
          <button type="button" onClick={startEditing}>
            Edit
          </button>
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </li>
  )
}
