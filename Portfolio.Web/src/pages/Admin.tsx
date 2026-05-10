import { useEffect, useState, type FormEvent } from 'react'
import { Lock, LogOut, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { LoadingBlock, ErrorBlock } from '@/components/States'
import { formatDate } from '@/lib/utils'
import {
  adminApi,
  clearAdminKey,
  getAdminKey,
  setAdminKey,
  type PostUpsert,
} from '@/lib/admin'
import type { BlogPost } from '@/lib/api'

const emptyForm: PostUpsert & { id: number | null } = {
  id: null,
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  tags: [],
  readingMinutes: 5,
  publish: false,
}

export function AdminPage() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminKey()))

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />
  }

  return <AdminConsole onSignOut={() => { clearAdminKey(); setAuthed(false) }} />
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [key, setKey] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    setAdminKey(key.trim())
    try {
      await adminApi.listAll()
      onSuccess()
    } catch (e) {
      clearAdminKey()
      setErr(e instanceof Error && e.message === 'UNAUTHORIZED' ? 'Wrong key.' : 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
          <Lock className="h-3.5 w-3.5" />
          Admin
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Enter the admin key to publish posts.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            type="password"
            autoFocus
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none"
          />
          <Button type="submit" disabled={busy || !key} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
          {err && <p className="text-center text-xs text-amber-400">{err}</p>}
        </form>
      </Card>
    </Container>
  )
}

function AdminConsole({ onSignOut }: { onSignOut: () => void }) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.listAll()
      setPosts(data)
    } catch (e) {
      if (e instanceof Error && e.message === 'UNAUTHORIZED') {
        onSignOut()
        return
      }
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function startEdit(post: BlogPost) {
    setForm({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      readingMinutes: post.readingMinutes,
      publish: Boolean(post.publishedAt),
    })
    setTagsInput(post.tags.join(', '))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startNew() {
    setForm(emptyForm)
    setTagsInput('')
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload: PostUpsert = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      readingMinutes: form.readingMinutes,
      publish: form.publish,
    }
    try {
      if (form.id == null) {
        await adminApi.create(payload)
        setFlash('Post created.')
      } else {
        await adminApi.update(form.id, payload)
        setFlash('Post updated.')
      }
      startNew()
      await refresh()
      setTimeout(() => setFlash(null), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  async function destroy(id: number) {
    if (!confirm('Delete this post permanently?')) return
    try {
      await adminApi.remove(id)
      await refresh()
      if (form.id === id) startNew()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const editing = form.id != null

  return (
    <Container className="pt-12 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Admin
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Posts</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onSignOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      {flash && (
        <div className="mt-6 rounded-md border border-[var(--color-accent)]/40 bg-[var(--color-accent-soft)]/40 px-4 py-2 font-mono text-xs text-[var(--color-accent)]">
          {flash}
        </div>
      )}

      <Card className="mt-8 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editing ? `Editing post #${form.id}` : 'New post'}
          </h2>
          {editing && (
            <Button variant="ghost" size="sm" onClick={startNew}>
              <X className="h-4 w-4" /> Cancel edit
            </Button>
          )}
        </div>

        <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Slug" hint="URL-friendly, e.g. my-first-post">
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={`${inputCls} font-mono`}
              />
            </Field>
          </div>

          <Field label="Excerpt" hint="One-sentence summary shown in lists.">
            <input
              required
              maxLength={500}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Content (Markdown)">
            <textarea
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={14}
              className={`${inputCls} resize-y font-mono text-sm leading-relaxed`}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Tags" hint="Comma-separated">
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder=".NET, EF Core"
                className={inputCls}
              />
            </Field>
            <Field label="Reading minutes">
              <input
                type="number"
                min={0}
                value={form.readingMinutes}
                onChange={(e) =>
                  setForm({ ...form, readingMinutes: Number(e.target.value) })
                }
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <label className="mt-2 flex h-9 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.publish}
                  onChange={(e) =>
                    setForm({ ...form, publish: e.target.checked })
                  }
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                <span>{form.publish ? 'Published' : 'Draft'}</span>
              </label>
            </Field>
          </div>

          {error && (
            <p className="text-sm text-amber-400">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {editing ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create post'}
            </Button>
          </div>
        </form>
      </Card>

      <h2 className="mt-12 text-lg font-semibold">All posts</h2>
      {loading && <LoadingBlock label="Loading posts" />}
      {!loading && error && <ErrorBlock message={error} />}
      {!loading && posts && posts.length === 0 && (
        <p className="mt-4 font-mono text-xs text-[var(--color-muted)]">
          No posts yet — create one above.
        </p>
      )}
      {!loading && posts && posts.length > 0 && (
        <div className="mt-4 divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)]">
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between gap-4 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{p.title}</span>
                  {p.publishedAt ? (
                    <Badge className="border-[var(--color-accent)]/40 text-[var(--color-accent)]">
                      published · {formatDate(p.publishedAt)}
                    </Badge>
                  ) : (
                    <Badge className="border-amber-500/30 text-amber-400">
                      draft
                    </Badge>
                  )}
                </div>
                <p className="mt-1 truncate font-mono text-xs text-[var(--color-muted)]">
                  /{p.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEdit(p)}
                  aria-label={`Edit ${p.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => destroy(p.id)}
                  aria-label={`Delete ${p.title}`}
                  className="hover:text-amber-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-[var(--color-muted)]">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]'
