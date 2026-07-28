'use client'

import { useState } from 'react'

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
        <span className="text-sm font-medium text-gray-700">Post LinkedIn</span>
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
      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
        {content}
      </pre>
    </div>
  )
}
