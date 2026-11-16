import { Bot } from 'lucide-react'

export function ThinkingIndicator() {
  return (
    <li className="flex items-start gap-2.5" role="status" aria-live="polite">
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary"
        aria-hidden="true"
      >
        <Bot className="size-4" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-sm">
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="size-2 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.15s]" />
          <span className="size-2 animate-bounce rounded-full bg-primary/40" />
        </span>
        <span className="animate-pulse text-sm font-medium text-muted-foreground">Thinking...</span>
      </div>
    </li>
  )
}
