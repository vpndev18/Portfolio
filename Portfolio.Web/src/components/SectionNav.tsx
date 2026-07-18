import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SectionNavProps {
  /** Section ids in page order, with the label to show for each. */
  sections: { id: string; label: string }[]
}

/**
 * Sticky index rail for the single-page home layout. Highlights whichever
 * section is currently in view and scrolls to it on click.
 *
 * Rendered as a fixed rail on large screens and a horizontal scroller under the
 * header on small ones, so it never eats vertical space on mobile.
 */
export function SectionNav({ sections }: SectionNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top of the viewport among those visible —
        // more stable than "last one that fired" when sections are short.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActive(visible[0].target.id)
      },
      // Top-weighted band: a section counts as active once its heading is in
      // the upper third of the screen.
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  const handleClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault()
    const el = document.getElementById(id)
    if (!el) return

    el.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
    // Keep the URL shareable without triggering a second scroll.
    window.history.replaceState(null, '', `#${id}`)
    setActive(id)
  }

  return (
    <>
      {/* Desktop: fixed rail to the left of the content column. */}
      <nav
        aria-label="Page sections"
        className="pointer-events-none fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
        style={{ width: 'max(1.5rem, calc((100vw - 64rem) / 2))' }}
      >
        <ul className="pointer-events-auto flex flex-col gap-1 pl-6">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={cn(
                  'group flex items-center gap-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors',
                  active === section.id
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                )}
                aria-current={active === section.id ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'h-px transition-all',
                    active === section.id
                      ? 'w-6 bg-[var(--color-accent)]'
                      : 'w-3 bg-[var(--color-border-strong)] group-hover:w-5',
                  )}
                  aria-hidden
                />
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile/tablet: horizontal pill scroller pinned under the header. */}
      <div className="sticky top-16 z-30 -mx-6 mb-2 border-y border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-lg xl:hidden">
        <ul className="flex gap-1 overflow-x-auto px-6 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={cn(
                  'inline-block whitespace-nowrap rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors',
                  active === section.id
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                )}
                aria-current={active === section.id ? 'true' : undefined}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
