import type { Message } from '../types'

const BASE_URL = '/api/messages'

export class ApiError extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const body: { message?: string } | null = await response.json().catch(() => null)
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export function listMessages(signal?: AbortSignal): Promise<Message[]> {
  return request<Message[]>('', { signal })
}

export function createMessage(name: string, text: string): Promise<Message> {
  return request<Message>('', { method: 'POST', body: JSON.stringify({ name, text }) })
}

export function updateMessage(id: number, text: string): Promise<Message> {
  return request<Message>(`/${id}`, { method: 'PUT', body: JSON.stringify({ text }) })
}

export function deleteMessage(id: number): Promise<void> {
  return request<void>(`/${id}`, { method: 'DELETE' })
}
