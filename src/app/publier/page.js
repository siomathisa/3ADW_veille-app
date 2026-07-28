'use client'

import Link from 'next/link'
import { useSources } from '@/hooks/useSources'
import SourceCard from '@/components/SourceCard'

export default function PublierPage() {
  const { sources, loading } = useSources()

  const readyToPublish = sources.filter(s => s.contenuGenere && s.statut !== 'publié')
  const published = sources.filter(s => s.statut === 'publié')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Publication</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Prêts à publier ({loading ? '...' : readyToPublish.length})
        </h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Chargement...</p>
        ) : readyToPublish.length === 0 ? (
          <div className="text-center py-10 bg-white border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500 text-sm mb-3">Aucun contenu en attente de publication</p>
            <Link href="/sources" className="text-blue-600 text-sm hover:underline">
              Générer du contenu depuis une source
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {readyToPublish.map(source => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Publiés ({loading ? '...' : published.length})
        </h2>
        {published.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune source publiée pour l'instant</p>
        ) : (
          <div className="grid gap-3">
            {published.map(source => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
