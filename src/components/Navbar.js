'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/sources', label: 'Sources' },
  { href: '/recherche', label: 'Recherche' },
  { href: '/ajouter', label: '+ Ajouter' },
  { href: '/publier', label: 'Publier' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <nav className="bg-gray-900 text-white px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="font-bold text-lg tracking-tight text-white">
        Veille IA
      </Link>
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors ${
              pathname === link.href
                ? 'text-blue-400 font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
