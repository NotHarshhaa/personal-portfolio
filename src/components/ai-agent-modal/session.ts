import { type AgentMessage, INITIAL_SUGGESTIONS } from '@/lib/agent-knowledge'

export const STORAGE_KEY = 'agent-chat-session'
export const MAX_STORED_MESSAGES = 30
export const MAX_INPUT_LENGTH = 500

export const WELCOME_MESSAGE: AgentMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I am Harshhaa's Portfolio Agent. I can answer questions about his Platform Engineering experience, AI Infrastructure & Agentic Systems work, technical stack, or open-source projects.",
  timestamp: 'now',
  suggestions: INITIAL_SUGGESTIONS,
}

export function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function isStoredMessages(value: unknown): value is AgentMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      m =>
        typeof m === 'object' &&
        m !== null &&
        typeof (m as AgentMessage).id === 'string' &&
        ((m as AgentMessage).role === 'user' ||
          (m as AgentMessage).role === 'assistant') &&
        typeof (m as AgentMessage).content === 'string' &&
        typeof (m as AgentMessage).timestamp === 'string'
    )
  )
}

export function loadStoredMessages(): AgentMessage[] {
  if (typeof window === 'undefined') return [WELCOME_MESSAGE]
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (isStoredMessages(parsed)) {
        return parsed.map(m => ({ ...m, streaming: false }))
      }
    }
  } catch {
    // Corrupted storage falls through to a fresh session
  }
  return [WELCOME_MESSAGE]
}
