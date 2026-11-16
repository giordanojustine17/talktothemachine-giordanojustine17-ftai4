import { Bot } from 'lucide-react'
import type { ChatMessage } from '@/lib/mock-chat'
import { cn } from '@/lib/utils'

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <li className={cn('flex items-start gap-2.5', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"
          aria-hidden="true"
        >
          <Bot className="size-4" />
        </div>
      )}
      <div className={cn('flex max-w-[85%] flex-col gap-1 sm:max-w-[70%]', isUser ? 'items-end' : 'items-start')}>
        <span className="sr-only">{isUser ? 'You said:' : 'Machine said:'}</span>
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-[15px] leading-relaxed text-pretty',
            isUser
              ? 'rounded-br-md bg-primary text-primary-foreground'
              : 'rounded-bl-md border border-border bg-card text-card-foreground shadow-sm',
          )}
        >
          {message.content}
        </div>
        <time className="px-1 text-xs text-muted-foreground">{message.time}</time>
      </div>
    </li>
  )
}
