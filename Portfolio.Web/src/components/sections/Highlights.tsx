import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/animation/Reveal'
import { highlights } from '@/config/highlights'

/** Awards, certifications, talks, OSS work. Hidden when nothing is configured. */
export function Highlights() {
  if (highlights.length === 0) return null

  return (
    <Container id="highlights" className="scroll-mt-24">
      <Reveal>
        <SectionHeading
          eyebrow="Proof"
          title="Highlights"
          description="Things worth calling out."
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {highlights.map((item, i) => {
          const Wrapper = item.url ? 'a' : 'div'

          return (
            <Reveal key={item.title} delay={i * 0.05}>
              <Wrapper
                {...(item.url
                  ? { href: item.url, target: '_blank', rel: 'noreferrer' }
                  : {})}
                className="card-glow group flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-5 transition-colors hover:border-[var(--color-border-strong)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
                    <Sparkles className="h-3 w-3" />
                    {item.kind}
                  </span>
                  {item.year && (
                    <span className="font-mono text-xs text-[var(--color-muted)]">
                      Issued {item.year}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 flex items-start gap-1 text-base font-semibold text-[var(--color-foreground)]">
                  {item.title}
                  {item.url && (
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" />
                  )}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {item.description}
                </p>

                {item.credentialId && (
                  <p className="mt-3 font-mono text-[11px] text-[var(--color-muted)]">
                    Credential ID{' '}
                    <span className="text-[var(--color-muted-strong)]">
                      {item.credentialId}
                    </span>
                  </p>
                )}
              </Wrapper>
            </Reveal>
          )
        })}
      </div>
    </Container>
  )
}
