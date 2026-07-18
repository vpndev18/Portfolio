import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/animation/Reveal'
import { skills } from '@/config/skills'

/** Categorised skill grid. Text-only by design — no icon CDN to slow the page. */
export function Skills() {
  if (skills.length === 0) return null

  return (
    <Container id="skills" className="scroll-mt-24">
      <Reveal>
        <SectionHeading
          eyebrow="Toolkit"
          title="Skills"
          description="Things I've used to ship something real, not things I've read about."
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.05}>
            <div className="card-glow h-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-5 transition-colors hover:border-[var(--color-border-strong)]">
              <div className="flex items-baseline gap-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {group.category}
                </h3>
                <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
                <span className="font-mono text-[11px] text-[var(--color-muted)]">
                  {String(group.items.length).padStart(2, '0')}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                {group.note}
              </p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-muted-strong)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  )
}
