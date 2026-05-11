import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons'
import { Container } from '@/components/ui/container'
import { siteConfig } from '@/config/site'

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[var(--color-border)] py-10">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} {siteConfig.fullName}. Built with .NET &amp; React.
        </p>
        <div className="flex items-center gap-1">
          <FooterLink href={siteConfig.socials.github} label="GitHub">
            <GithubIcon className="h-4 w-4" />
          </FooterLink>
          <FooterLink href={siteConfig.socials.linkedin} label="LinkedIn">
            <LinkedinIcon className="h-4 w-4" />
          </FooterLink>
          <FooterLink href={`mailto:${siteConfig.email}`} label="Email">
            <Mail className="h-4 w-4" />
          </FooterLink>
        </div>
      </Container>
    </footer>
  )
}

function FooterLink({
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
      className="grid h-9 w-9 place-items-center rounded-md text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
    >
      {children}
    </a>
  )
}
