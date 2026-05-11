import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="font-mono text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
        404
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-[var(--color-muted)]">
        The link is broken, or the page has moved. Try one of these instead.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link to="/">Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/projects">See projects</Link>
        </Button>
      </div>
    </Container>
  )
}
