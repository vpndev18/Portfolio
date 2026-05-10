export interface Project {
  id: number
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  liveUrl: string | null
  repoUrl: string | null
  techStack: string[]
  displayOrder: number
  createdAt: string
}

export interface PostListItem {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  publishedAt: string
  readingMinutes: number
}

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  publishedAt: string
  readingMinutes: number
  createdAt: string
  updatedAt: string
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: 'application/json' } })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${path}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  listProjects: () => getJson<Project[]>('/api/projects/'),
  getProject: (slug: string) => getJson<Project>(`/api/projects/${slug}`),
  listPosts: () => getJson<PostListItem[]>('/api/posts/'),
  getPost: (slug: string) => getJson<BlogPost>(`/api/posts/${slug}`),
}
