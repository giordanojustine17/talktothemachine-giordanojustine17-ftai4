export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  time: string
  promptTokens?: number
  completionTokens?: number
}

export type TokenUsage = {
  prompt: number
  completion: number
}

export const MODEL_NAME = 'qwen/qwen3.8-27b'

export const initialMessages: ChatMessage[] = []

export function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function usageFromMessages(messages: ChatMessage[]): TokenUsage {
  return messages.reduce<TokenUsage>(
    (acc, m) => {
      if (m.role === 'user' && m.promptTokens) acc.prompt += m.promptTokens
      if (m.role === 'assistant' && m.completionTokens) acc.completion += m.completionTokens
      return acc
    },
    { prompt: 0, completion: 0 },
  )
}
