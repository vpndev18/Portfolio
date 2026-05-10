import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, onMouseMove, ...props }, ref) => {
    function handleMove(e: MouseEvent<HTMLDivElement>) {
      const rect = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
      onMouseMove?.(e)
    }
    return (
      <div
        ref={ref}
        onMouseMove={handleMove}
        className={cn(
          'card-glow group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 backdrop-blur-sm transition-colors hover:border-[var(--color-border-strong)]',
          className,
        )}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'
