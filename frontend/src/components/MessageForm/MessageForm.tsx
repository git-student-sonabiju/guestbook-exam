import { useState, type FormEvent } from 'react'
import { validateName, validateText } from '../../utils/validation'

interface MessageFormProps {
  onPost: (name: string, text: string) => Promise<boolean>
}

export function MessageForm({ onPost }: MessageFormProps) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const error = validateName(name) ?? validateText(text)
    setValidationError(error)
    if (error) {
      return
    }
    setSubmitting(true)
    const posted = await onPost(name, text)
    setSubmitting(false)
    if (posted) {
      setName('')
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label>
        Name
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Message
        <textarea value={text} onChange={(event) => setText(event.target.value)} />
      </label>
      {validationError && <p role="alert">{validationError}</p>}
      <button type="submit" disabled={submitting}>
        Post
      </button>
    </form>
  )
}
