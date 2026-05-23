import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIXES = [
  '/feed', '/events', '/petitions', '/politicians', '/missing', '/help', '/admin',
]

// Cookie names better-auth uses for session tokens
const SESSION_COOKIE_NAMES = ['better-auth.session_token', '__Secure-better-auth.session_token']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const hasSession = SESSION_COOKIE_NAMES.some(name => request.cookies.has(name))
  if (!hasSession) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox).*)'],
}
