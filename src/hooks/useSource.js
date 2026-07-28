'use client'

import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useSource(id) {
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const unsubscribe = onSnapshot(doc(db, 'sources', id), (snapshot) => {
      if (snapshot.exists()) {
        setSource({ id: snapshot.id, ...snapshot.data() })
      } else {
        setSource(null)
      }
      setLoading(false)
    }, () => {
      setLoading(false)
    })
    return () => unsubscribe()
  }, [id])

  return { source, loading }
}
