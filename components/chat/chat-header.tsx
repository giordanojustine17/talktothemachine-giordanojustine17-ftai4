import { Cpu, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChatHeaderProps = {
  modelName: string
  onClear: () => void
  canClear: boolean
}

export function ChatHeader({ modelName, onClear, canClear }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"
          aria-hidden="true"
        >
          <Cpu className="size-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Talk to the Machine
          </h1>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="sr-only">Model:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              {modelName}
            </span>
          </div>
        </div>
      </div>
      <Button variant="outline" onClick={onClear} disabled={!canClear} className="shrink-0">
        <Trash2 className="size-4" aria-hidden="true" />
        Clear
      </Button>
    </header>
  )
}
