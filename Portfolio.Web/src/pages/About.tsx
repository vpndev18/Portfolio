import { Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/animation/Reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CoderAvatar } from '@/components/CoderAvatar'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
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
  useDocumentTitle('About')
  return (
    <Container className="pt-16 pb-8">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="group transition-transform duration-300 hover:rotate-[-2deg]">
            <CoderAvatar className="max-w-[160px] sm:max-w-[180px]" />
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
              About
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Hi, I'm {siteConfig.fullName}.
            </h1>
            <p className="mt-3 font-mono text-sm text-[var(--color-muted)]">
              {siteConfig.role}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-[var(--color-muted-strong)]">
            <p>
              I'm a backend-leaning engineer who spends most days in .NET and the rest in React.
              I like well-shaped APIs, ergonomic data models, and code that's boring on purpose.
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
