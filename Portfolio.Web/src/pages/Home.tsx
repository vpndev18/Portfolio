import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/animation/Reveal'
import { ProjectCard } from '@/components/ProjectCard'
import { PostCard } from '@/components/PostCard'
import { CardSkeleton, ErrorBlock, Empty } from '@/components/States'
import { Button } from '@/components/ui/button'
import { useFetch } from '@/hooks/useFetch'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { api } from '@/lib/api'
import { siteConfig } from '@/config/site'

export function HomePage() {
  useDocumentTitle('Vallabh — Backend Engineer')
  const projects = useFetch(api.listProjects, [])
  const posts = useFetch(api.listPosts, [])

  return (
    <>
      <Hero />

      <Container className="mt-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Selected work"
              title="Projects"
              description="A few things I've built recently."
            />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/projects">
                All projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="mt-8">
          {projects.loading && <CardSkeleton count={4} />}
          {projects.error && <ErrorBlock message={projects.error.message} />}
          {projects.data && projects.data.length === 0 && (
            <Empty>No projects yet.</Empty>
          )}
          {projects.data && projects.data.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.data.slice(0, 4).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Container className="mt-32">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Writing"
              title="Recent posts"
              description="Notes from things I'm building and learning."
            />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/blog">
                All posts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="mt-8">
          {posts.loading && <CardSkeleton count={3} />}
          {posts.error && <ErrorBlock message={posts.error.message} />}
          {posts.data && posts.data.length === 0 && (
            <Empty>No posts yet — new ones land here as soon as they're written.</Empty>
          )}
          {posts.data && posts.data.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {posts.data.slice(0, 3).map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </Container>

      <Container className="mt-32">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-8 py-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Got a project in mind?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
              I'm open to backend, full-stack, and contract work. Let's talk.
            </p>
            <Button asChild size="lg" className="mt-7">
              <a href={`mailto:${siteConfig.email}`}>
                Say hello <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </Container>
    </>
  )
}
