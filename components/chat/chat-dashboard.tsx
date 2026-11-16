'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import {
  MODEL_NAME,
  formatTime,
  initialMessages,
  usageFromMessages,
  type ChatMessage,
} from '@/lib/mock-chat'
import { ChatHeader } from './chat-header'
import { TokenMetrics } from './token-metrics'
import { MessageBubble } from './message-bubble'
import { ThinkingIndicator } from './thinking-indicator'
import { ChatInput } from './chat-input'

const STORAGE_KEY = 'talk-to-machine-messages'

export function ChatDashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatMessage[]
        setMessages(parsed)
      } catch (e) {
        console.error('Failed to parse stored messages:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages, isMounted])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isThinking])

  async function handleSend(text: string) {
    setError(null)
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      time: formatTime(new Date()),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setIsThinking(true)

    try {
      const conversationHistory = [
        ...messages,
        userMessage,
      ].map((m) => ({ role: m.role, content: m.content }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      })

      if (!response.ok) {
        const error = await response.json() as { error: string }
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json() as {
        message: string
        model: string
        usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        time: formatTime(new Date()),
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Chat error:', err)
    } finally {
      setIsThinking(false)
    }
  }

  function handleClear() {
    setMessages([])
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-4xl flex-col sm:py-6">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-card sm:rounded-3xl sm:border sm:border-border sm:shadow-sm">
        <ChatHeader modelName={MODEL_NAME} onClear={handleClear} canClear={messages.length > 0 || isThinking} />
        <TokenMetrics usage={usageFromMessages(messages)} />

        <main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 py-6 sm:px-6">
          {messages.length === 0 && !isThinking ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <MessageSquare className="size-6" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Start a conversation</h2>
              <p className="max-w-xs text-sm text-muted-foreground text-balance">
                Send a message below and talk to the machine with real AI responses.
              </p>
            </div>
          ) : (
            <ol className="flex flex-col gap-5" aria-label="Conversation">
              {error && (
                <li className="flex items-start gap-2.5">
                  <div className="flex max-w-[85%] flex-col gap-1 sm:max-w-[70%]">
                    <div className="rounded-2xl rounded-bl-md border border-red-500/50 bg-red-50 px-4 py-3 text-sm text-red-900">
                      <p className="font-medium">Error:</p>
                      <p className="mt-1">{error}</p>
                    </div>
                  </div>
                </li>
              )}
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {isThinking && <ThinkingIndicator />}
            </ol>
          )}
          <div ref={endRef} />
        </main>

        <ChatInput onSend={handleSend} disabled={isThinking} />
      </div>
    </div>
  )
}
