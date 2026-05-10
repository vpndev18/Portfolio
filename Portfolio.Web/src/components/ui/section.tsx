import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-[var(--color-muted)]">{description}</p>
      )}
    </div>
  )
}
