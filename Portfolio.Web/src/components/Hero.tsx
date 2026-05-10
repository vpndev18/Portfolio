import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { siteConfig } from '@/config/site'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        className="absolute inset-0 grid-bg opacity-40"
        aria-hidden
        style={{
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 30%, black 40%, transparent 80%)',
        }}
      />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 font-mono text-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent)]" />
          </span>
          <span className="uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Available for new work
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
        >
          <span className="text-gradient">{siteConfig.fullName}.</span>
          <br />
          <span className="text-[var(--color-muted)]">{siteConfig.role}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-muted)]"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg">
            <Link to="/projects">
              View work <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href={`mailto:${siteConfig.email}`}>
              <Mail className="h-4 w-4" /> Get in touch
            </a>
          </Button>
          <div className="ml-2 flex items-center gap-1">
            <IconLink href={siteConfig.socials.github} label="GitHub">
              <GithubIcon className="h-4 w-4" />
            </IconLink>
            <IconLink href={siteConfig.socials.linkedin} label="LinkedIn">
              <LinkedinIcon className="h-4 w-4" />
            </IconLink>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-md text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
    >
      {children}
    </a>
  )
}
