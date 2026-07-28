'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { useSource } from '@/hooks/useSource'
import TagEditor from '@/components/TagEditor'
import PostGenere from '@/components/PostGenere'

const LEGITIMITE_COLORS = {
  haute: 'bg-green-100 text-green-800',
  moyenne: 'bg-yellow-100 text-yellow-800',
  faible: 'bg-red-100 text-red-800',
}

export default function SourceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { source, loading } = useSource(id)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <p className="text-gray-500 text-sm">Chargement...</p>
  if (!source) return <p className="text-gray-500 text-sm">Source introuvable</p>

  async function updateTags(tags) {
    await updateDoc(doc(db, 'sources', id), { tags })
  }

  async function generateContent() {
    setGenerating(true)
    setError('')
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/generer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sourceId: id }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur lors de la génération')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function markPublished() {
    await updateDoc(doc(db, 'sources', id), { statut: 'publié' })
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← Retour
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">
            {source.titre || source.url}
          </h1>
          {source.legitimite && (
            <span className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium ${LEGITIMITE_COLORS[source.legitimite] || 'bg-gray-100 text-gray-600'}`}>
              {source.legitimite}
            </span>
          )}
        </div>

        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm hover:underline break-all mb-5 block"
        >
          {source.url}
        </a>

        <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium text-gray-900 mt-0.5">{source.type || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Provenance</p>
            <p className="font-medium text-gray-900 mt-0.5">{source.provenance || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Catégorie</p>
            <p className="font-medium text-gray-900 mt-0.5">{source.categorie || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Humeur</p>
            <p className="font-medium text-gray-900 mt-0.5">{source.humeur || '-'}</p>
          </div>
        </div>

        {source.interet && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Pourquoi c'est intéressant</p>
            <p className="text-sm text-gray-800 leading-relaxed">{source.interet}</p>
          </div>
        )}

        {source.apportPersonnel && (
          <div className="mb-5">
            <p className="text-sm text-gray-500 mb-1">En quoi ca t'augmente</p>
            <p className="text-sm text-gray-800 leading-relaxed">{source.apportPersonnel}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500 mb-2">Tags</p>
          <TagEditor tags={source.tags || []} onChange={updateTags} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Contenu généré</h2>
          {!source.contenuGenere && (
            <button
              onClick={generateContent}
              disabled={generating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {generating ? 'Génération...' : 'Générer un post LinkedIn'}
            </button>
          )}
          {source.contenuGenere && (
            <button
              onClick={generateContent}
              disabled={generating}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              {generating ? 'Régénération...' : 'Régénérer'}
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        {source.contenuGenere ? (
          <PostGenere
            content={source.contenuGenere}
            onPublish={source.statut !== 'publié' ? markPublished : null}
          />
        ) : (
          <p className="text-gray-500 text-sm">
            Aucun contenu généré. Clique sur "Générer un post LinkedIn" pour créer du contenu à partir de cette source.
          </p>
        )}
      </div>
    </div>
  )
}
