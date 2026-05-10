import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

function isMac() {
  return typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)
}

function dispatchCmdK() {
  // Synthetic event the palette listens for.
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: isMac(),
      ctrlKey: !isMac(),
      bubbles: true,
    }),
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-lg'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6 sm:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 font-mono text-sm font-semibold"
          aria-label="Home"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)] transition-colors group-hover:border-[var(--color-accent)]">
            {siteConfig.name.charAt(0).toUpperCase()}
          </span>
          <span className="text-[var(--color-foreground)]">
            {siteConfig.name.toLowerCase()}
            <span className="text-[var(--color-accent)]">.dev</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'relative hidden rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:inline-block',
                  isActive
                    ? 'text-[var(--color-foreground)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-[var(--color-accent)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={dispatchCmdK}
            aria-label="Open command palette"
            className="ml-1 inline-flex h-9 items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs text-[var(--color-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)] sm:px-3"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden rounded border border-[var(--color-border)] px-1 font-mono text-[10px] sm:inline">
              {isMac() ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noreferrer"
            download
            className="ml-1 hidden h-9 items-center gap-1.5 rounded-md bg-[var(--color-accent)] px-3 text-xs font-medium text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)]/90 sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            CV
          </a>
        </nav>
      </div>
    </header>
  )
}
