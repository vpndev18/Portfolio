import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Nav } from './Nav'
import { Footer } from './Footer'
import { CommandPalette } from '@/components/CommandPalette'

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
      <CommandPalette />
    </div>
  )
}
