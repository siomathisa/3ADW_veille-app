'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'

async function parseJsonSafe(res) {
  try {
    return await res.json()
  } catch {
    throw new Error('Le serveur a mis trop de temps à répondre, réessaie.')
  }
}

export default function RecherchePage() {
  const [question, setQuestion] = useState('')
  const [searching, setSearching] = useState(false)
  const [ragResult, setRagResult] = useState(null)
  const [ragError, setRagError] = useState('')

  const [sujet, setSujet] = useState('')
  const [webSearching, setWebSearching] = useState(false)
  const [webResults, setWebResults] = useState(null)
  const [webError, setWebError] = useState('')
  const [addingUrl, setAddingUrl] = useState(null)

  const router = useRouter()

  async function handleRagSearch(e) {
    e.preventDefault()
    if (!question.trim()) return
    setSearching(true)
    setRagError('')
    setRagResult(null)
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/recherche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: question.trim() }),
      })
      const data = await parseJsonSafe(res)
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la recherche')
      setRagResult(data)
    } catch (err) {
      setRagError(err.message)
    } finally {
      setSearching(false)
    }
  }

  async function handleWebSearch(e) {
    e.preventDefault()
    if (!sujet.trim()) return
    setWebSearching(true)
    setWebError('')
    setWebResults(null)
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/veille-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sujet: sujet.trim() }),
      })
      const data = await parseJsonSafe(res)
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la recherche web')
      setWebResults(data.resultats || [])
    } catch (err) {
      setWebError(err.message)
    } finally {
      setWebSearching(false)
    }
  }

  async function addResultAsSource(url) {
    setAddingUrl(url)
    setWebError('')
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch('/api/qualifier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url }),
      })
      const data = await parseJsonSafe(res)
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'ajout")
      router.push(`/sources/${data.id}`)
    } catch (err) {
      setWebError(err.message)
    } finally {
      setAddingUrl(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recherche</h1>
        <p className="text-gray-500 text-sm mt-1">
          Interroge ta base de veille ou trouve de nouvelles sources sur le web.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Interroger ma veille</h2>
        <p className="text-sm text-gray-500 mb-4">
          Pose une question, la réponse s'appuie uniquement sur les sources déjà qualifiées dans l'app.
        </p>
        <form onSubmit={handleRagSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ex : qu'est-ce que j'ai retenu sur les nouveaux modèles IA ?"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {searching ? '...' : 'Chercher'}
          </button>
        </form>

        {ragError && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
            {ragError}
          </p>
        )}

        {ragResult && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-800 leading-relaxed mb-3">{ragResult.reponse}</p>
            {ragResult.sources?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ragResult.sources.map(s => (
                  <a
                    key={s.id}
                    href={`/sources/${s.id}`}
                    className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {s.titre || s.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Trouver de nouvelles sources</h2>
        <p className="text-sm text-gray-500 mb-4">
          Un agent IA cherche sur le web des sources récentes sur un sujet donné. Tu choisis ensuite lesquelles
          ajouter à ta veille.
        </p>
        <form onSubmit={handleWebSearch} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            value={sujet}
            onChange={e => setSujet(e.target.value)}
            placeholder="Ex : gestion de projet digital, agents IA en entreprise..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <button
            type="submit"
            disabled={webSearching}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {webSearching ? 'Recherche...' : 'Chercher sur le web'}
          </button>
        </form>

        {webError && (
          <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded px-3 py-2">
            {webError}
          </p>
        )}

        {webResults && webResults.length === 0 && (
          <p className="text-gray-500 text-sm">Aucun résultat trouvé.</p>
        )}

        {webResults && webResults.length > 0 && (
          <div className="space-y-3">
            {webResults.map(r => (
              <div key={r.url} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{r.titre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{r.provenance}</p>
                    <p className="text-sm text-gray-700 mt-2">{r.resume}</p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-all mt-2 block"
                    >
                      {r.url}
                    </a>
                  </div>
                  <button
                    onClick={() => addResultAsSource(r.url)}
                    disabled={addingUrl === r.url}
                    className="shrink-0 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {addingUrl === r.url ? 'Ajout...' : '+ Ajouter'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
