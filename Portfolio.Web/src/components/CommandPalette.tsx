import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileText,
  Hash,
  Mail,
  Search,
  Sparkles,
} from 'lucide-react'
import { api, type PostListItem, type Project } from '@/lib/api'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  group: string
  label: string
  hint?: string
  icon: ReactNode
  perform: () => void
  keywords?: string
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [posts, setPosts] = useState<PostListItem[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  // Global keybinding: Cmd/Ctrl+K toggles, Esc closes.
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [open])

  // Lazy-load content the first time the palette opens.
  useEffect(() => {
    if (!open || (posts.length && projects.length)) return
    Promise.all([api.listPosts(), api.listProjects()])
      .then(([p, pr]) => {
        setPosts(p)
        setProjects(pr)
      })
      .catch(() => {
        // Network error: leave empty; nav routes still searchable.
      })
  }, [open, posts.length, projects.length])

  // Reset state when closed.
  useEffect(() => {
    if (!open) {
      setQuery('')
      setActive(0)
    } else {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const items: CommandItem[] = useMemo(() => {
    const close = () => setOpen(false)
    const go = (path: string) => () => {
      close()
      navigate(path)
    }

    const navItems: CommandItem[] = [
      { id: 'go-home', group: 'Go to', label: 'Home', icon: <Sparkles className="h-4 w-4" />, perform: go('/'), keywords: 'home start landing' },
      ...siteConfig.nav.map((n) => ({
        id: `go-${n.href}`,
        group: 'Go to',
        label: n.label,
        icon: iconFor(n.href),
        perform: go(n.href),
        keywords: n.href,
      })),
      {
        id: 'email',
        group: 'Actions',
        label: `Email ${siteConfig.email}`,
        icon: <Mail className="h-4 w-4" />,
        perform: () => {
          window.location.href = `mailto:${siteConfig.email}`
          close()
        },
        keywords: 'contact mail reach',
      },
      {
        id: 'resume',
        group: 'Actions',
        label: 'Download résumé (PDF)',
        icon: <FileText className="h-4 w-4" />,
        perform: () => {
          window.open(siteConfig.resumeUrl, '_blank')
          close()
        },
        keywords: 'cv resume curriculum download',
      },
    ]

    const projectItems: CommandItem[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      group: 'Projects',
      label: p.title,
      hint: p.shortDescription,
      icon: <Briefcase className="h-4 w-4" />,
      perform: go(`/projects/${p.slug}`),
      keywords: `${p.slug} ${p.techStack.join(' ')}`,
    }))

    const postItems: CommandItem[] = posts.map((p) => ({
      id: `post-${p.slug}`,
      group: 'Posts',
      label: p.title,
      hint: p.excerpt,
      icon: <BookOpen className="h-4 w-4" />,
      perform: go(`/blog/${p.slug}`),
      keywords: `${p.slug} ${p.tags.join(' ')}`,
    }))

    return [...navItems, ...projectItems, ...postItems]
  }, [navigate, posts, projects])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => {
      const hay = `${it.label} ${it.hint ?? ''} ${it.keywords ?? ''} ${it.group}`.toLowerCase()
      return hay.includes(q)
    })
  }, [items, query])

  // Group filtered items by group for headings.
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    filtered.forEach((it) => {
      const arr = map.get(it.group) ?? []
      arr.push(it)
      map.set(it.group, arr)
    })
    return Array.from(map.entries())
  }, [filtered])

  // Keep active index inside bounds when query changes.
  useEffect(() => {
    setActive((a) => Math.min(a, Math.max(filtered.length - 1, 0)))
  }, [filtered.length])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => (a + 1) % Math.max(filtered.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        filtered[active]?.perform()
      }
    },
    [filtered, active],
  )

  // Scroll active row into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-cmd-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh]"
      onKeyDown={onKeyDown}
    >
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4">
          <Search className="h-4 w-4 text-[var(--color-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, posts, anything…"
            className="h-12 w-full bg-transparent text-sm placeholder:text-[var(--color-muted)] focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-muted)] sm:inline">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center font-mono text-xs text-[var(--color-muted)]">
              No results for "{query}"
            </div>
          ) : (
            grouped.map(([group, list], gIdx) => {
              const baseIdx = grouped
                .slice(0, gIdx)
                .reduce((acc, [, l]) => acc + l.length, 0)
              return (
                <div key={group} className="py-1">
                  <div className="px-4 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {group}
                  </div>
                  {list.map((it, i) => {
                    const idx = baseIdx + i
                    const isActive = idx === active
                    return (
                      <button
                        key={it.id}
                        data-cmd-index={idx}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => it.perform()}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          isActive
                            ? 'bg-[var(--color-surface-elevated)] text-[var(--color-foreground)]'
                            : 'text-[var(--color-muted-strong)] hover:bg-[var(--color-surface-elevated)]/60',
                        )}
                      >
                        <span
                          className={cn(
                            'grid h-7 w-7 shrink-0 place-items-center rounded-md border',
                            isActive
                              ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                              : 'border-[var(--color-border)] bg-[var(--color-background)]',
                          )}
                        >
                          {it.icon}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {it.label}
                          </span>
                          {it.hint && (
                            <span className="block truncate text-xs text-[var(--color-muted)]">
                              {it.hint}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent)]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-background)]/40 px-4 py-2 font-mono text-[10px] text-[var(--color-muted)]">
          <span>
            <kbd className="rounded border border-[var(--color-border)] px-1">↑↓</kbd> navigate
            <span className="mx-1">·</span>
            <kbd className="rounded border border-[var(--color-border)] px-1">↵</kbd> open
          </span>
          <span>
            <kbd className="rounded border border-[var(--color-border)] px-1">⌘</kbd>
            <kbd className="ml-0.5 rounded border border-[var(--color-border)] px-1">K</kbd> to toggle
          </span>
        </div>
      </div>
    </div>
  )
}

function iconFor(href: string): ReactNode {
  if (href.startsWith('/projects')) return <Briefcase className="h-4 w-4" />
  if (href.startsWith('/blog')) return <BookOpen className="h-4 w-4" />
  if (href.startsWith('/now')) return <Sparkles className="h-4 w-4" />
  return <Hash className="h-4 w-4" />
}
