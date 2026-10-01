export const MAX_TEXT_LENGTH = 200

export function validateText(text: string): string | null {
  if (text.trim() === '') {
    return 'Text is required'
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return `Text must be at most ${MAX_TEXT_LENGTH} characters`
  }
  return null
}

export function validateName(name: string): string | null {
  return name.trim() === '' ? 'Name is required' : null
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}
