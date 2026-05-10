import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

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
                  'relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
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
        </nav>
      </div>
    </header>
  )
}
