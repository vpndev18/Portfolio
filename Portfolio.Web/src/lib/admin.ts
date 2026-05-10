import { apiUrl, type BlogPost } from './api'

const KEY_STORAGE = 'portfolio.adminKey'

export function getAdminKey(): string | null {
  return sessionStorage.getItem(KEY_STORAGE)
}

export function setAdminKey(key: string) {
  sessionStorage.setItem(KEY_STORAGE, key)
}

export function clearAdminKey() {
  sessionStorage.removeItem(KEY_STORAGE)
}

export interface PostUpsert {
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  readingMinutes: number
  publish: boolean
}

async function adminFetch(path: string, init?: RequestInit): Promise<Response> {
  const key = getAdminKey()
  return fetch(apiUrl(path), {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Admin-Key': key ?? '',
    },
  })
}

export const adminApi = {
  async listAll(): Promise<BlogPost[]> {
    const res = await adminFetch('/api/admin/posts/')
    if (res.status === 401) throw new Error('UNAUTHORIZED')
    if (!res.ok) throw new Error(`List failed (${res.status})`)
    return res.json()
  },
  async create(input: PostUpsert): Promise<BlogPost> {
    const res = await adminFetch('/api/admin/posts/', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    if (res.status === 401) throw new Error('UNAUTHORIZED')
    if (!res.ok) throw new Error((await res.json()).error ?? `Create failed (${res.status})`)
    return res.json()
  },
  async update(id: number, input: PostUpsert): Promise<BlogPost> {
    const res = await adminFetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    })
    if (res.status === 401) throw new Error('UNAUTHORIZED')
    if (!res.ok) throw new Error((await res.json()).error ?? `Update failed (${res.status})`)
    return res.json()
  },
  async remove(id: number): Promise<void> {
    const res = await adminFetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    if (res.status === 401) throw new Error('UNAUTHORIZED')
    if (!res.ok && res.status !== 204) throw new Error(`Delete failed (${res.status})`)
  },
}
