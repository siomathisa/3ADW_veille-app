import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/requireAuth'
import anthropic from '@/lib/anthropic'
import { rechercheSynthesePrompt } from '@/lib/prompts'

const STOPWORDS = new Set(['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'ou', 'pour', 'sur', 'dans', 'en', 'au', 'aux', 'a', 'est', 'qui', 'que', 'avec', 'ce', 'ces', 'mon', 'ma', 'mes', 'quel', 'quelle', 'comment'])

const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g')

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .match(/[a-z0-9]+/g) || []
}

export async function POST(request) {
  try {
    const user = await requireAuth(request)
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { question } = await request.json()
    if (!question || !question.trim()) return NextResponse.json({ error: 'Question requise' }, { status: 400 })

    const snap = await adminDb.collection('sources').orderBy('dateAjout', 'desc').get()
    const sources = []
    snap.forEach(doc => sources.push({ id: doc.id, ...doc.data() }))

    if (sources.length === 0) {
      return NextResponse.json({ reponse: "Aucune source enregistrée pour l'instant.", sources: [] })
    }

    const queryTokens = tokenize(question).filter(t => t.length > 2 && !STOPWORDS.has(t))

    const scored = sources.map(source => {
      const haystack = tokenize([
        source.titre,
        source.interet,
        source.apportPersonnel,
        source.provenance,
        source.categorie,
        (source.tags || []).join(' '),
      ].join(' '))
      const score = queryTokens.reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0)
      return { source, score }
    })

    scored.sort((a, b) => b.score - a.score)
    const hasMatches = scored.some(s => s.score > 0)
    const relevant = (hasMatches ? scored.filter(s => s.score > 0) : scored).slice(0, 8).map(s => s.source)

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      thinking: { type: 'disabled' },
      messages: [{ role: 'user', content: rechercheSynthesePrompt({ question, sources: relevant }) }],
    })

    const textBlock = message.content.find(block => block.type === 'text')
    if (!textBlock) throw new Error('Réponse Claude sans contenu texte')

    return NextResponse.json({
      reponse: textBlock.text.trim(),
      sources: relevant.map(s => ({ id: s.id, titre: s.titre, url: s.url })),
    })
  } catch (err) {
    console.error('[recherche]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
