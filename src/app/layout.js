import { Inter } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import AppShell from '@/components/AppShell'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Veille IA',
  description: 'Votre second cerveau pour la veille intelligente',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
