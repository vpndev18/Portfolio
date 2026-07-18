import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { SectionNav } from '@/components/SectionNav'
import { Skills } from '@/components/sections/Skills'
import { Highlights } from '@/components/sections/Highlights'
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
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons'

/**
 * Single-page home: an indexed narrative (hero → work → skills → writing →
 * highlights → contact) with a sticky section rail. The standalone
 * /projects and /blog routes still exist for deep links and the ⌘K palette.
 */
export function HomePage() {
  useDocumentTitle('Vallabh — Backend Engineer')

  // Cache keys turn repeat visits and back-navigation into instant paints.
  const projects = useFetch(api.listProjects, [], 'projects')
  const posts = useFetch(api.listPosts, [], 'posts')

  return (
    <>
      <Hero />

      <SectionNav sections={[...siteConfig.sections]} />

      <div className="space-y-28 sm:space-y-36">
        {/* ── Projects ─────────────────────────────────────────────────── */}
        <Container id="projects" className="scroll-mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Selected work"
                title="Projects"
                description="A few things I've built recently."
              />
              <Button asChild variant="ghost" size="sm" className="hidden shrink-0 sm:inline-flex">
                <Link to="/projects">
                  All projects <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <div className="mt-10">
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

        <Skills />

        {/* ── Writing ──────────────────────────────────────────────────── */}
        <Container id="blog" className="scroll-mt-24">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow="Writing"
                title="Recent posts"
                description="Notes from things I'm building and learning."
              />
              <Button asChild variant="ghost" size="sm" className="hidden shrink-0 sm:inline-flex">
                <Link to="/blog">
                  All posts <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <div className="mt-10">
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

        <Highlights />

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <Container id="contact" className="scroll-mt-24 pb-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-6 py-14 text-center sm:px-8">
              <div
                className="absolute inset-0 grid-bg opacity-30"
                aria-hidden
                style={{
                  maskImage:
                    'radial-gradient(ellipse 60% 60% at 50% 40%, black 20%, transparent 75%)',
                }}
              />

              <div className="relative">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  Contact
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Got a project in mind?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
                  I'm open to backend, full-stack, and contract work. Let's talk.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild size="lg">
                    <a href={`mailto:${siteConfig.email}`}>
                      <Mail className="h-4 w-4" /> Say hello
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <a
                      href={siteConfig.socials.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <GithubIcon className="h-4 w-4" /> GitHub
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                    <a
                      href={siteConfig.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LinkedinIcon className="h-4 w-4" /> LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </div>
    </>
  )
}
