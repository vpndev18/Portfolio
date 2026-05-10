import { ArrowUpRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import type { PostListItem } from '@/lib/api'

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <Card className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between gap-3 font-mono text-xs text-[var(--color-muted)]">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingMinutes} min
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-accent)]">
          {post.title}
          <ArrowUpRight className="ml-1 inline-block h-4 w-4 -translate-y-px transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-1" />
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  )
}
