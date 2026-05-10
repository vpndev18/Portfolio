import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './index.css'
import { Layout } from '@/components/layout/Layout'
import { LoadingBlock } from '@/components/States'

// Route-level code splitting. Each page becomes its own JS chunk so the
// initial load only ships the layout + home — everything else is fetched
// on demand.
const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })))
const ProjectsPage = lazy(() => import('@/pages/Projects').then((m) => ({ default: m.ProjectsPage })))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetail').then((m) => ({ default: m.ProjectDetailPage })))
const BlogPage = lazy(() => import('@/pages/Blog').then((m) => ({ default: m.BlogPage })))
const PostDetailPage = lazy(() => import('@/pages/PostDetail').then((m) => ({ default: m.PostDetailPage })))
const AboutPage = lazy(() => import('@/pages/About').then((m) => ({ default: m.AboutPage })))
const NowPage = lazy(() => import('@/pages/Now').then((m) => ({ default: m.NowPage })))
const AdminPage = lazy(() => import('@/pages/Admin').then((m) => ({ default: m.AdminPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFoundPage })))

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<LoadingBlock />}>{node}</Suspense>
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: withSuspense(<HomePage />) },
      { path: '/projects', element: withSuspense(<ProjectsPage />) },
      { path: '/projects/:slug', element: withSuspense(<ProjectDetailPage />) },
      { path: '/blog', element: withSuspense(<BlogPage />) },
      { path: '/blog/:slug', element: withSuspense(<PostDetailPage />) },
      { path: '/about', element: withSuspense(<AboutPage />) },
      { path: '/now', element: withSuspense(<NowPage />) },
      { path: '/admin', element: withSuspense(<AdminPage />) },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
