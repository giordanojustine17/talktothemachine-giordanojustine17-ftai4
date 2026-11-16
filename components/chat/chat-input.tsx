'use client'

import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChatInputProps = {
  onSend: (text: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const canSend = value.trim().length > 0 && !disabled

  function submit() {
    if (!canSend) return
    onSend(value.trim())
    setValue('')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Enter' || e.shiftKey) return
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    e.preventDefault()
    submit()
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card px-4 py-4 sm:px-6">
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted p-2 focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/15">
        <label htmlFor="chat-message" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-message"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the machine anything..."
          className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground field-sizing-content"
        />
        <Button type="submit" size="lg" disabled={!canSend} className="h-10 shrink-0 rounded-xl px-4">
          <span className="hidden sm:inline">Send</span>
          <SendHorizontal className="size-4" aria-hidden="true" />
          <span className="sr-only sm:hidden">Send</span>
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Press Enter to send, Shift + Enter for a new line.
      </p>
    </form>
  )
}
