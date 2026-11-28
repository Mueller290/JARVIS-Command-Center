import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const pathname = request.nextUrl.pathname;
  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/auth/');

  // Keep public auth pages reachable so they can explain missing configuration.
  // Redirecting /login to itself here would create an infinite redirect loop.
  if (!url || !key) {
    console.error('Supabase environment variables are missing.');
    if (isPublicRoute) return response;
    return NextResponse.redirect(new URL('/login?error=auth_not_configured', request.url));
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  // getClaims validates the JWT. Signed-out visitors legitimately receive null data.
  const { data, error } = await supabase.auth.getClaims();
  if (error) console.error('Supabase session validation failed:', error.message);
  const claims = data?.claims ?? null;

  if (!claims && !isPublicRoute) {
    const destination = request.nextUrl.clone();
    destination.pathname = '/login';
    destination.search = '';
    destination.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(destination);
  }

  if (claims && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
