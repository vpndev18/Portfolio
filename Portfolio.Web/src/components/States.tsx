import type { ReactNode } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoadingBlock({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 font-mono text-sm text-[var(--color-muted)]">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{label}…</span>
    </div>
  )
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 py-12 text-center">
      <AlertTriangle className="h-6 w-6 text-amber-400" />
      <p className="text-sm text-[var(--color-muted-strong)]">
        Something went wrong loading this page.
      </p>
      <p className="font-mono text-xs text-[var(--color-muted)]">{message}</p>
    </div>
  )
}

export function CardSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40"
        />
      ))}
    </div>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--color-border)] py-12 text-center font-mono text-sm text-[var(--color-muted)]">
      {children}
    </div>
  )
}
