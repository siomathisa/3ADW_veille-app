import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/requireAuth'
import anthropic from '@/lib/anthropic'
import { genererPrompt } from '@/lib/prompts'

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
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      thinking: { type: 'disabled' },
      messages: [
        {
          role: 'user',
          content: genererPrompt({ source }),
        },
      ],
    })

    const textBlock = message.content.find(block => block.type === 'text')
    if (!textBlock) throw new Error('Réponse Claude sans contenu texte')
    const contenuGenere = textBlock.text.trim()

    await docRef.update({
      contenuGenere,
      statut: 'traité',
    })

    return NextResponse.json({ contenuGenere })
  } catch (err) {
    console.error('[generer]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
