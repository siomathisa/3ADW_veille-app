import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { adminDb } from '@/lib/firebaseAdmin'
import { requireAuth } from '@/lib/requireAuth'
import anthropic from '@/lib/anthropic'
import { qualifierPrompt } from '@/lib/prompts'

async function fetchMetadata(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VeilleBot/1.0)' },
      signal: AbortSignal.timeout(6000),
    })
    const html = await res.text()

    const ogTitle = html.match(/property=["']og:title["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || html.match(/content=["']([^"']+)["'][^>]*property=["']og:title["']/i)?.[1]
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim()
    const desc = html.match(/name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]
      || html.match(/content=["']([^"']+)["'][^>]*name=["']description["']/i)?.[1]
    const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return {
      titre: ogTitle || title || '',
      description: desc || '',
      contenu: bodyText.slice(0, 1500),
    }
  } catch {
    return { titre: '', description: '', contenu: '' }
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth(request)
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

    const { url } = await request.json()
    if (!url) return NextResponse.json({ error: 'URL requise' }, { status: 400 })

    const metadata = await fetchMetadata(url)

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: qualifierPrompt({ url, ...metadata }),
        },
      ],
    })

    const textBlock = message.content.find(block => block.type === 'text')
    if (!textBlock) throw new Error('Réponse Claude sans contenu texte')
    const text = textBlock.text.trim()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Réponse Claude invalide')

    const qualification = JSON.parse(jsonMatch[0])

    const docRef = await adminDb.collection('sources').add({
      url,
      titre: qualification.titre || '',
      type: qualification.type || 'article',
      provenance: qualification.provenance || '',
      legitimite: qualification.legitimite || 'moyenne',
      interet: qualification.interet || '',
      apportPersonnel: qualification.apportPersonnel || '',
      categorie: qualification.categorie || 'pro',
      tags: qualification.tags || [],
      humeur: qualification.humeur || 'neutre',
      contenuGenere: '',
      resumeReactions: '',
      statut: 'traité',
      dateAjout: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ id: docRef.id, ...qualification })
  } catch (err) {
    console.error('[qualifier]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
