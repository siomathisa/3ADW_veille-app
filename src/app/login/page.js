'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { user, loading, authError, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.replace('/')
  }, [loading, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 -mt-8">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-sm w-full text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Veille IA</h1>
        <p className="text-gray-500 text-sm mb-6">Accès réservé, connecte-toi avec ton compte Google.</p>

        {authError && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {authError}
          </p>
        )}

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Se connecter avec Google
        </button>
      </div>
    </div>
  )
}
