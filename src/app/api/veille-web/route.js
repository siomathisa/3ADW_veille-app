import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/requireAuth'
import anthropic from '@/lib/anthropic'
import { veilleWebPrompt } from '@/lib/prompts'

export async function POST(request) {
  try {
    const user = await requireAuth(request)
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { sujet } = await request.json()
    if (!sujet || !sujet.trim()) return NextResponse.json({ error: 'Sujet requis' }, { status: 400 })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1536,
      thinking: { type: 'disabled' },
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
      messages: [{ role: 'user', content: veilleWebPrompt({ sujet }) }],
    })

    const text = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim()

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) throw new Error("L'agent n'a pas retourné de résultats exploitables")

    const resultats = JSON.parse(jsonMatch[0])

    return NextResponse.json({ resultats })
  } catch (err) {
    console.error('[veille-web]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
