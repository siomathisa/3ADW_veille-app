'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import AuthGuard from './AuthGuard'

export default function AppShell({ children }) {
  const pathname = usePathname()

  if (pathname === '/login') {
    return <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
  }

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </AuthGuard>
  )
}
