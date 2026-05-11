import { Calendar, Mail } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Reveal } from '@/components/animation/Reveal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { nowContent } from '@/config/now'
import { siteConfig } from '@/config/site'

export function NowPage() {
  useDocumentTitle('Now')
  return (
    <Container className="pt-16 pb-8">
      <Reveal>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          <Calendar className="h-3.5 w-3.5" />
          Now · updated {formatDate(nowContent.updatedAt)}
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          What I'm doing now
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--color-muted)]">{nowContent.intro}</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
        {nowContent.sections.map((s, i) => (
          <Reveal key={s.heading} delay={i * 0.05}>
            <Card className="h-full p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                {s.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-[var(--color-muted-strong)]"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-12 max-w-xl text-sm text-[var(--color-muted)]">
          This is a{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            /now page
          </a>
          . If you have one, link it here.
        </p>
        <div className="mt-6">
          <Button asChild size="md">
            <a href={`mailto:${siteConfig.email}`}>
              <Mail className="h-4 w-4" /> Want to chat?
            </a>
          </Button>
        </div>
      </Reveal>
    </Container>
  )
}
