'use client'

import { useState } from 'react'
import TagBadge from './TagBadge'

export default function TagEditor({ tags = [], onChange }) {
  const [input, setInput] = useState('')

  function addTag() {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  function removeTag(tag) {
    onChange(tags.filter(t => t !== tag))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2 min-h-[24px]">
        {tags.map(tag => (
          <TagBadge key={tag} tag={tag} onRemove={removeTag} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder="Ajouter un tag..."
          className="text-sm border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={addTag}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
