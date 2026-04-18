import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Proteção contra Open Redirect: só permite caminhos relativos internos
  const rawNext = searchParams.get("next") ?? "/gestao";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/gestao";


  if (code) {
    // 1. Criamos a resposta de redirecionamento antecipadamente
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // 2. Troca o código temporário pela sessão real
    // Importante: Isso vincula a identidade do Google ao usuário logado (linkIdentity)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      const { provider_token, provider_refresh_token } = data.session;

      /**
       * 3. PERSISTÊNCIA DE METADATA
       * Salvamos o status para a UI (Badge Verde) e o token para uso imediato.
       * Nota: provider_refresh_token só vem se o prompt for 'consent'.
       */
      await supabase.auth.updateUser({
        data: {
          google_calendar_connected: true,
          google_calendar_token: provider_token,
          // Guardamos o refresh_token se ele vier, para renovar o acesso no futuro
          ...(provider_refresh_token && { google_calendar_refresh_token: provider_refresh_token }),
          last_google_sync: new Date().toISOString(),
        },
      });

      // 4. Retorna com a sessão configurada nos cookies
      return response;
    }
  }

  // Erro: Algo deu errado no meio do caminho ou o código é inválido
  console.error("[Auth Callback] Erro na troca de código ou código ausente.");
  return NextResponse.redirect(`${origin}/gestao?calendar_error=auth_failed`);
}