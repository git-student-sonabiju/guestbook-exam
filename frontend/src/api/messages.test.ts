import { ApiError, createMessage, deleteMessage } from './messages'

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

describe('messages api', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws an ApiError carrying the server message on failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse(400, { message: 'Text is required' }))

    await expect(createMessage('Alice', '')).rejects.toEqual(new ApiError('Text is required'))
  })

  it('falls back to the status code when the error body is not JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('oops', { status: 502 }))

    await expect(deleteMessage(1)).rejects.toThrow('Request failed with status 502')
  })

  it('resolves a 204 delete without parsing a body', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))

    await expect(deleteMessage(1)).resolves.toBeUndefined()
  })
})
