'use client'

import Link from 'next/link'
import { useSources } from '@/hooks/useSources'
import SourceCard from '@/components/SourceCard'

export default function Dashboard() {
  const { sources, loading } = useSources()

  const stats = {
    total: sources.length,
    traites: sources.filter(s => s.statut === 'traité' || s.statut === 'publié').length,
    publies: sources.filter(s => s.statut === 'publié').length,
  }

  const recent = sources.slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Votre base de veille intelligente</p>
        </div>
        <Link
          href="/ajouter"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Ajouter une source
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Sources totales</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Traitées</p>
          <p className="text-3xl font-bold text-blue-600">{stats.traites}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Publiées</p>
          <p className="text-3xl font-bold text-green-600">{stats.publies}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sources récentes</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Chargement...</p>
        ) : recent.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500 mb-4">Aucune source pour l'instant</p>
            <Link href="/ajouter" className="text-blue-600 text-sm font-medium hover:underline">
              Ajouter votre première source
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {recent.map(source => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
