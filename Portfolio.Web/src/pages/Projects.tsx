import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/animation/Reveal'
import { ProjectCard } from '@/components/ProjectCard'
import { CardSkeleton, Empty, ErrorBlock } from '@/components/States'
import { useFetch } from '@/hooks/useFetch'
import { api } from '@/lib/api'

export function ProjectsPage() {
  const { data, loading, error } = useFetch(api.listProjects, [])

  return (
    <Container className="pt-16 pb-8">
      <Reveal>
        <SectionHeading
          eyebrow="Work"
          title="Things I've built"
          description="A mix of reference implementations, learning projects, and small apps. Each one taught me something about the stack it uses."
        />
      </Reveal>

      <div className="mt-12">
        {loading && <CardSkeleton count={6} className="md:grid-cols-2" />}
        {error && <ErrorBlock message={error.message} />}
        {data && data.length === 0 && <Empty>No projects yet.</Empty>}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
