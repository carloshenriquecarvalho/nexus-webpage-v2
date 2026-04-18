import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const updateSession = async (request: NextRequest) => {
  try {
    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      supabaseUrl!,
      supabaseKey!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const { data: { user } } = await supabase.auth.getUser();

    // Rotas privadas — exigem autenticação
    const privateRoutes = ['/gestao', '/crm', '/martech-lab'];
    const isPrivate = privateRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    );

    if (!user && isPrivate) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Redireciona usuários logados para fora da página de login
    if (user && request.nextUrl.pathname === '/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/gestao';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
