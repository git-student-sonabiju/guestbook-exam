import { useEffect, useState } from 'react'
import { createMessage, deleteMessage, listMessages, updateMessage } from './api/messages'
import { MessageForm } from './components/MessageForm/MessageForm'
import { MessageItem } from './components/MessageItem/MessageItem'
import type { Message } from './types'

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong'
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    listMessages(controller.signal)
      .then((loaded) => setMessages(loaded))
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(errorMessage(loadError))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [])

  async function runAction(action: () => Promise<void>): Promise<boolean> {
    setError(null)
    try {
      await action()
      return true
    } catch (actionError) {
      setError(errorMessage(actionError))
      return false
    }
  }

  function handlePost(name: string, text: string) {
    return runAction(async () => {
      const created = await createMessage(name, text)
      setMessages((current) => [created, ...current])
    })
  }

  function handleSave(id: number, text: string) {
    return runAction(async () => {
      const updated = await updateMessage(id, text)
      setMessages((current) => current.map((message) => (message.id === id ? updated : message)))
    })
  }

  function handleDelete(id: number) {
    return runAction(async () => {
      await deleteMessage(id)
      setMessages((current) => current.filter((message) => message.id !== id))
    })
  }

  return (
    <main>
      <h1>Guestbook</h1>
      <MessageForm onPost={handlePost} />
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} onSave={handleSave} onDelete={handleDelete} />
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
