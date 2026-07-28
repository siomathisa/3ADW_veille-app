import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/requireAuth'
import anthropic from '@/lib/anthropic'
import { pertinencePrompt } from '@/lib/prompts'

export async function POST(request) {
  try {
    const user = await requireAuth(request)
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { sourceId } = await request.json()
    if (!sourceId) return NextResponse.json({ error: 'sourceId requis' }, { status: 400 })

    const docRef = adminDb.collection('sources').doc(sourceId)
    const snap = await docRef.get()
    if (!snap.exists) return NextResponse.json({ error: 'Source introuvable' }, { status: 404 })

    const source = { id: snap.id, ...snap.data() }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: pertinencePrompt({ source }),
        },
      ],
    })

    const textBlock = message.content.find(block => block.type === 'text')
    if (!textBlock) throw new Error('Réponse Claude sans contenu texte')
    const text = textBlock.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Réponse Claude invalide')

    const data = JSON.parse(jsonMatch[0])

    await docRef.update({
      humeur: data.humeur,
      resumeReactions: data.resumeReactions,
    })

    return NextResponse.json(data)
  } catch (err) {
    console.error('[pertinence]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
