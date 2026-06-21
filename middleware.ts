import { NextRequest, NextResponse } from 'next/server'


export function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl


  // Allow Next.js files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname === '/favicon.ico'
  ) {

    return NextResponse.next()

  }



  // Public pages
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/patient-register',
    '/desk-register',
    '/auth/callback',
  ]



  if (
    publicRoutes.includes(pathname)
  ) {

    return NextResponse.next()

  }



  /*
    Authentication is handled
    by Supabase client side.

    Do not check cookies here.
    Otherwise Vercel deployment
    can redirect users incorrectly.
  */


  return NextResponse.next()

}



export const config = {

  matcher: [

    '/((?!_next/static|_next/image|favicon.ico).*)',

  ],

}