'use client'

import { useState } from 'react'

const NOM = 'Mathis Vidueira'
const INTITULE = 'Étudiant en Bachelor Développement Web chez decode. | Chef de Projet IA & No-Code en alternance chez Phoenix Performance'

export default function PostGenere({ content, onPublish }) {
  const [copied, setCopied] = useState(false)

  async function copyToClipboard() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Aperçu LinkedIn</span>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="text-xs bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
          >
            {copied ? 'Copié !' : 'Copier'}
          </button>
          {onPublish && (
            <button
              onClick={onPublish}
              className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition-colors"
            >
              Marquer comme publié
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 flex items-start gap-3">
          <img
            src="/profile.jpg"
            alt={NOM}
            className="w-12 h-12 rounded-full object-cover shrink-0"
            style={{ objectPosition: '35% 25%' }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-tight">{NOM}</p>
            <p className="text-xs text-gray-500 leading-snug mt-0.5">{INTITULE}</p>
            <p className="text-xs text-gray-400 mt-1">À l'instant · 🌐</p>
          </div>
          <span className="text-gray-400 text-lg leading-none">···</span>
        </div>

        <div className="px-4 pb-3">
          <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </pre>
        </div>

        <div className="border-t border-gray-100 px-2 py-1 flex items-center justify-around text-xs text-gray-500">
          <span className="px-2 py-1.5">👍 J'aime</span>
          <span className="px-2 py-1.5">💬 Commenter</span>
          <span className="px-2 py-1.5">🔁 Republier</span>
          <span className="px-2 py-1.5">➤ Envoyer</span>
        </div>
      </div>
    </div>
  )
}
