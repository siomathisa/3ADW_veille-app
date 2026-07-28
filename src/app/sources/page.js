'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSources } from '@/hooks/useSources'
import SourceCard from '@/components/SourceCard'

const CATEGORIES = ['toutes', 'métier', 'pro', 'perso', 'culture']
const STATUTS = ['tous', 'à-traiter', 'traité', 'publié']

export default function SourcesPage() {
  const { sources, loading } = useSources()
  const [categorie, setCategorie] = useState('toutes')
  const [statut, setStatut] = useState('tous')

  const filtered = sources.filter(s => {
    if (categorie !== 'toutes' && s.categorie !== categorie) return false
    if (statut !== 'tous' && s.statut !== statut) return false
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Sources {!loading && `(${sources.length})`}
        </h1>
        <Link
          href="/ajouter"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Ajouter
        </Link>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap items-center">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategorie(c)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              categorie === c
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {c}
          </button>
        ))}
        <div className="w-px h-5 bg-gray-300 mx-1" />
        {STATUTS.map(s => (
          <button
            key={s}
            onClick={() => setStatut(s)}
            className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
              statut === s
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500">Aucune source avec ces filtres</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(source => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  )
}
