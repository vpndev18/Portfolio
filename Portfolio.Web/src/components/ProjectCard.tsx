import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Project } from '@/lib/api'

interface ProjectCardProps {
  project: Project
  variant?: 'compact' | 'full'
}

export function ProjectCard({ project, variant = 'full' }: ProjectCardProps) {
  const description =
    variant === 'compact' ? project.shortDescription : project.shortDescription

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <Link
          to={`/projects/${project.slug}`}
          className="text-lg font-semibold text-[var(--color-foreground)] transition-colors hover:text-[var(--color-accent)]"
        >
          {project.title}
          <ArrowUpRight className="ml-1 inline-block h-4 w-4 -translate-y-px transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-1" />
        </Link>
        <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
          {project.repoUrl && (
            <ExternalIcon href={project.repoUrl} label="Repository">
              <GithubIcon className="h-4 w-4" />
            </ExternalIcon>
          )}
          {project.liveUrl && (
            <ExternalIcon href={project.liveUrl} label="Live demo">
              <ExternalLink className="h-4 w-4" />
            </ExternalIcon>
          )}
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
        {description}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 6).map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
        {project.techStack.length > 6 && (
          <Badge>+{project.techStack.length - 6}</Badge>
        )}
      </div>
    </Card>
  )
}

function ExternalIcon({
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
      onClick={(e) => e.stopPropagation()}
      className="grid h-8 w-8 place-items-center rounded-md text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
    >
      {children}
    </a>
  )
}
