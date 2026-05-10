import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/Home'
import { ProjectsPage } from '@/pages/Projects'
import { ProjectDetailPage } from '@/pages/ProjectDetail'
import { BlogPage } from '@/pages/Blog'
import { PostDetailPage } from '@/pages/PostDetail'
import { AboutPage } from '@/pages/About'
import { AdminPage } from '@/pages/Admin'
import { NowPage } from '@/pages/Now'
import { NotFoundPage } from '@/pages/NotFound'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/projects/:slug', element: <ProjectDetailPage /> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/blog/:slug', element: <PostDetailPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/now', element: <NowPage /> },
      { path: '/admin', element: <AdminPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
