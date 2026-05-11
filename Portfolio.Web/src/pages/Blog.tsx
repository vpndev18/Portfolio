import { Container } from '@/components/ui/container'
import { SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/animation/Reveal'
import { PostCard } from '@/components/PostCard'
import { CardSkeleton, Empty, ErrorBlock } from '@/components/States'
import { useFetch } from '@/hooks/useFetch'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { api } from '@/lib/api'

export function BlogPage() {
  useDocumentTitle('Writing')
  const { data, loading, error } = useFetch(api.listPosts, [])

  return (
    <Container className="pt-16 pb-8">
      <Reveal>
        <SectionHeading
          eyebrow="Writing"
          title="Notes on what I'm building"
          description="Short, opinionated posts on .NET, React, architecture, and the tools I reach for."
        />
      </Reveal>

      <div className="mt-12">
        {loading && <CardSkeleton count={6} className="md:grid-cols-2" />}
        {error && <ErrorBlock message={error.message} />}
        {data && data.length === 0 && (
          <Empty>No posts yet — first one is on its way.</Empty>
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
