import Link from 'next/link'
import TagBadge from './TagBadge'

const LEGITIMITE_COLORS = {
  haute: 'bg-green-100 text-green-800',
  moyenne: 'bg-yellow-100 text-yellow-800',
  faible: 'bg-red-100 text-red-800',
}

const STATUT_COLORS = {
  'à-traiter': 'bg-gray-100 text-gray-600',
  traité: 'bg-blue-100 text-blue-700',
  publié: 'bg-green-100 text-green-700',
}

export default function SourceCard({ source }) {
  return (
    <Link href={`/sources/${source.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">
            {source.titre || source.url}
          </h3>
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUT_COLORS[source.statut] || STATUT_COLORS['à-traiter']}`}>
            {source.statut || 'à-traiter'}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-3 truncate">{source.url}</p>

        {source.interet && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{source.interet}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {source.legitimite && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${LEGITIMITE_COLORS[source.legitimite] || ''}`}>
              {source.legitimite}
            </span>
          )}
          {source.type && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {source.type}
            </span>
          )}
          {(source.tags || []).slice(0, 3).map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {(source.tags || []).length > 3 && (
            <span className="text-xs text-gray-400">+{source.tags.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
