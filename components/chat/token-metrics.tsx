import type { TokenUsage } from '@/lib/mock-chat'
import { cn } from '@/lib/utils'

export function TokenMetrics({ usage }: { usage: TokenUsage }) {
  const metrics = [
    { label: 'Prompt', value: usage.prompt },
    { label: 'Completion', value: usage.completion },
    { label: 'Total', value: usage.prompt + usage.completion, highlight: true },
  ]

  return (
    <section aria-label="Token usage" className="border-b border-border bg-card px-4 py-3 sm:px-6">
      <dl className="grid grid-cols-3 gap-2 sm:gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={cn(
              'rounded-xl border px-3 py-2 sm:px-4',
              m.highlight ? 'border-primary/20 bg-secondary' : 'border-border bg-muted',
            )}
          >
            <dt className="text-xs font-medium text-muted-foreground">{m.label}</dt>
            <dd
              className={cn(
                'font-mono text-base font-semibold tabular-nums sm:text-lg',
                m.highlight ? 'text-secondary-foreground' : 'text-foreground',
              )}
            >
              {m.value.toLocaleString()}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
