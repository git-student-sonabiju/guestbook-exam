import { useState, type FormEvent } from 'react'
import { MAX_TEXT_LENGTH, validateName, validateText } from '../../utils/validation'

interface MessageFormProps {
  onPost: (name: string, text: string) => Promise<boolean>
}

export function MessageForm({ onPost }: MessageFormProps) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const overLimit = text.length > MAX_TEXT_LENGTH

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
    <form className="card compose" onSubmit={handleSubmit} noValidate>
      <h2 className="compose-title">Leave a message</h2>
      <label className="field">
        <span className="field-label">Name</span>
        <input
          className="input"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="field">
        <span className="field-label">Message</span>
        <textarea
          className="input textarea"
          placeholder="Say something nice..."
          rows={3}
          aria-describedby="message-counter"
          aria-invalid={overLimit}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <div className="compose-footer">
        <span id="message-counter" className={overLimit ? 'counter counter-over' : 'counter'}>
          {text.length}/{MAX_TEXT_LENGTH}
          {overLimit && ' - too long'}
        </span>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          Post
        </button>
      </div>
      {validationError && (
        <p role="alert" className="inline-error">
          {validationError}
        </p>
      )}
    </form>
  )
}
