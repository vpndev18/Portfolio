import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/BrandIcons'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LoadingBlock, ErrorBlock } from '@/components/States'
import { Reveal } from '@/components/animation/Reveal'
import { useFetch } from '@/hooks/useFetch'
import { api } from '@/lib/api'

export function ProjectDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data, loading, error } = useFetch(() => api.getProject(slug), [slug])

  return (
    <Container className="pt-16 pb-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-3 w-3" /> All projects
      </Link>

      <div className="mt-8">
        {loading && <LoadingBlock label="Loading project" />}
        {error && <ErrorBlock message={error.message} />}
        {data && (
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {data.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted)]">
              {data.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-1.5">
              {data.techStack.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {data.repoUrl && (
                <Button asChild variant="secondary" size="md">
                  <a href={data.repoUrl} target="_blank" rel="noreferrer">
                    <GithubIcon className="h-4 w-4" /> Repository
                  </a>
                </Button>
              )}
              {data.liveUrl && (
                <Button asChild size="md">
                  <a href={data.liveUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" /> Live demo
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-12 max-w-2xl space-y-5 text-base leading-relaxed text-[var(--color-muted-strong)]">
              {data.longDescription.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </Container>
  )
}
