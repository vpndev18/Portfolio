import { Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/animation/Reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

const skillGroups: Array<{ heading: string; items: string[] }> = [
  {
    heading: 'Backend',
    items: [
      'C# / .NET 8/9',
      'ASP.NET Core',
      'Minimal APIs',
      'EF Core',
      'MediatR',
      'FluentValidation',
      'Serilog',
    ],
  },
  {
    heading: 'Data',
    items: ['PostgreSQL', 'SQL Server', 'Redis', 'Qdrant'],
  },
  {
    heading: 'Frontend',
    items: ['React 19', 'TypeScript', 'Vite', 'Tailwind', 'Zustand', 'TanStack Query'],
  },
  {
    heading: 'Platform',
    items: ['Docker', 'GitHub Actions', 'Azure', 'JWT / OAuth'],
  },
]

export function AboutPage() {
  return (
    <Container className="pt-16 pb-8">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          About
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          A short version
        </h1>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-[var(--color-muted-strong)]">
            <p>
              I'm <strong className="font-semibold text-[var(--color-foreground)]">{siteConfig.fullName}</strong>,
              a backend-leaning engineer who spends most days in .NET and the rest in React. I like
              well-shaped APIs, ergonomic data models, and code that's boring on purpose.
            </p>
            <p>
              The projects you see on this site are how I keep current — each one is an excuse to
              try a stack, a pattern, or a tool I've been reading about. Some are reference
              implementations; some are real things I use.
            </p>
            <p>
              I write about what I learn under{' '}
              <a
                className="text-[var(--color-accent)] underline underline-offset-4 decoration-[rgba(52,211,153,0.4)] hover:decoration-[var(--color-accent)]"
                href="/blog"
              >
                Writing
              </a>
              . If anything here resonates — or you want help with backend, full-stack, or contract
              work — please reach out.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {siteConfig.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {siteConfig.email}
              </span>
            </div>

            <div className="pt-4">
              <Button asChild size="md">
                <a href={`mailto:${siteConfig.email}`}>Get in touch</a>
              </Button>
            </div>
          </div>

          <aside className="space-y-8">
            {skillGroups.map((group) => (
              <div key={group.heading}>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {group.heading}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </div>
      </Reveal>
    </Container>
  )
}
