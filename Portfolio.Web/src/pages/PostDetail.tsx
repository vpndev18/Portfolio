import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/ui/badge'
import { LoadingBlock, ErrorBlock } from '@/components/States'
import { Reveal } from '@/components/animation/Reveal'
import { ReadingProgress } from '@/components/ReadingProgress'
import { CodeBlock } from '@/components/CodeBlock'
import { useFetch } from '@/hooks/useFetch'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDate } from '@/lib/utils'
import { api } from '@/lib/api'

export function PostDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { data, loading, error } = useFetch(() => api.getPost(slug), [slug])
  useDocumentTitle(data?.title ?? null)

  return (
    <Container className="pt-16 pb-8">
      {data && <ReadingProgress />}
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-3 w-3" /> All posts
      </Link>

      <div className="mt-8">
        {loading && <LoadingBlock label="Loading post" />}
        {error && <ErrorBlock message={error.message} />}
        {data && (
          <Reveal>
            <article>
              <header className="border-b border-[var(--color-border)] pb-8">
                <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-muted)]">
                  <time dateTime={data.publishedAt}>
                    {formatDate(data.publishedAt)}
                  </time>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {data.readingMinutes} min read
                  </span>
                </div>
                <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                  {data.title}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-[var(--color-muted)]">
                  {data.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {data.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </header>

              <div className="prose-portfolio mt-10 max-w-2xl">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{ pre: CodeBlock }}
                >
                  {data.content}
                </ReactMarkdown>
              </div>
            </article>
          </Reveal>
        )}
      </div>
    </Container>
  )
}
