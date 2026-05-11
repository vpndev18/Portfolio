import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/animation/Reveal'
import { ProjectCard } from '@/components/ProjectCard'
import { CardSkeleton, Empty, ErrorBlock } from '@/components/States'
import { cn } from '@/lib/utils'
import { useFetch } from '@/hooks/useFetch'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { api } from '@/lib/api'

export function ProjectsPage() {
  useDocumentTitle('Projects')
  const { data, loading, error } = useFetch(api.listProjects, [])
  const [filter, setFilter] = useState<string | null>(null)

  // Aggregate unique tech across all projects, ordered by frequency.
  const techStacks = useMemo(() => {
    if (!data) return []
    const counts = new Map<string, number>()
    data.forEach((p) =>
      p.techStack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
    )
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name]) => name)
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    if (!filter) return data
    return data.filter((p) => p.techStack.includes(filter))
  }, [data, filter])

  return (
    <Container className="pt-16 pb-8">
      <Reveal>
        <SectionHeading
          eyebrow="Work"
          title="Things I've built"
          description="A mix of reference implementations, learning projects, and small apps. Each one taught me something about the stack it uses."
        />
      </Reveal>

      {data && data.length > 0 && (
        <Reveal delay={0.05}>
          <div className="mt-8 -mx-2 flex flex-wrap items-center gap-1.5 px-2">
            <FilterPill
              active={filter === null}
              onClick={() => setFilter(null)}
              label="All"
              count={data.length}
            />
            {techStacks.map((t) => {
              const count = data.filter((p) => p.techStack.includes(t)).length
              return (
                <FilterPill
                  key={t}
                  active={filter === t}
                  onClick={() => setFilter(filter === t ? null : t)}
                  label={t}
                  count={count}
                />
              )
            })}
          </div>
        </Reveal>
      )}

      <div className="mt-8">
        {loading && <CardSkeleton count={6} className="md:grid-cols-2" />}
        {error && <ErrorBlock message={error.message} />}
        {data && data.length === 0 && <Empty>No projects yet.</Empty>}
        {data && data.length > 0 && filtered.length === 0 && (
          <Empty>
            No projects matching "<span className="text-[var(--color-foreground)]">{filter}</span>".
          </Empty>
        )}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

function FilterPill({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs transition-colors',
        active
          ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-strong)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-foreground)]',
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'rounded-sm px-1 py-px text-[10px]',
          active
            ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
            : 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)]',
        )}
      >
        {count}
      </span>
    </button>
  )
}
