'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_EMAIL

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && ALLOWED_EMAIL && firebaseUser.email !== ALLOWED_EMAIL) {
        setAuthError("Ce compte Google n'est pas autorisé à accéder à cette app.")
        await signOut(auth)
        setUser(null)
      } else {
        setUser(firebaseUser)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  async function login() {
    setAuthError('')
    await signInWithPopup(auth, new GoogleAuthProvider())
  }

  async function logout() {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
