import { adminAuth } from '@/lib/firebaseAdmin'

const ALLOWED_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_EMAIL

export async function requireAuth(request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return null

  try {
    const decoded = await adminAuth.verifyIdToken(token)
    if (!ALLOWED_EMAIL || decoded.email !== ALLOWED_EMAIL) return null
    return decoded
  } catch {
    return null
  }
}
