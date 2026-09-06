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
  const [analyzingPertinence, setAnalyzingPertinence] = useState(false)
  const [pertinenceError, setPertinenceError] = useState('')
  const [optimizingSeo, setOptimizingSeo] = useState(false)
  const [seoError, setSeoError] = useState('')

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

  async function analyzePertinence() {
    setAnalyzingPertinence(true)
    setPertinenceError('')
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/pertinence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sourceId: id }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de l'analyse de pertinence")
      }
    } catch (err) {
      setPertinenceError(err.message)
    } finally {
      setAnalyzingPertinence(false)
    }
  }

  async function optimizeSeo() {
    setOptimizingSeo(true)
    setSeoError('')
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sourceId: id }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de l'optimisation SEO")
      }
    } catch (err) {
      setSeoError(err.message)
    } finally {
      setOptimizingSeo(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← Retour
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
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

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="font-semibold text-gray-900">Pertinence et perception</h2>
          <button
            onClick={analyzePertinence}
            disabled={analyzingPertinence}
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {analyzingPertinence ? 'Analyse...' : source.resumeReactions ? 'Réanalyser' : 'Analyser la pertinence'}
          </button>
        </div>

        {pertinenceError && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
            {pertinenceError}
          </p>
        )}

        {source.resumeReactions ? (
          <p className="text-sm text-gray-800 leading-relaxed">{source.resumeReactions}</p>
        ) : (
          <p className="text-gray-500 text-sm">
            Aucune analyse pour l'instant. Clique sur "Analyser la pertinence" pour évaluer la perception et les réactions autour de cette source.
          </p>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
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

        {source.contenuGenere && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="text-sm font-medium text-gray-700">Optimisation SEO</h3>
              <button
                onClick={optimizeSeo}
                disabled={optimizingSeo}
                className="text-xs bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {optimizingSeo ? 'Optimisation...' : source.seo ? 'Réoptimiser' : 'Optimiser SEO'}
              </button>
            </div>

            {seoError && (
              <p className="text-red-600 text-sm mb-3 bg-red-50 border border-red-200 rounded px-3 py-2">
                {seoError}
              </p>
            )}

            {source.seo && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Titre SEO : </span>
                  <span className="text-gray-800">{source.seo.titreSeo}</span>
                </div>
                <div>
                  <span className="text-gray-500">Meta description : </span>
                  <span className="text-gray-800">{source.seo.metaDescription}</span>
                </div>
                {source.seo.motsCles?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {source.seo.motsCles.map(mot => (
                      <span key={mot} className="text-xs bg-white border border-gray-300 rounded-full px-2.5 py-0.5 text-gray-600">
                        {mot}
                      </span>
                    ))}
                  </div>
                )}
                {source.seo.suggestionStructure && (
                  <p className="text-gray-600 text-xs pt-1">{source.seo.suggestionStructure}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
