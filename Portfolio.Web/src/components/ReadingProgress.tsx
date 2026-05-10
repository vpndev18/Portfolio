import { useEffect, useState } from 'react'

// Thin progress bar that tracks how far down the document the user has scrolled.
// Renders below the sticky nav so it doesn't fight the nav border.
export function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function update() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const next = max > 0 ? (window.scrollY / max) * 100 : 0
      setPct(Math.min(100, Math.max(0, next)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-30 h-px">
      <div
        className="h-full bg-[var(--color-accent)] shadow-[0_0_12px_rgba(52,211,153,0.6)] transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
