// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * updateSession
 * - Creates a server-side supabase client that maps cookie updates into the NextResponse
 * - Ensures we do NOT mutate request.cookies directly (not allowed)
 * - If Supabase attempts to set cookies, we mirror them on NextResponse.cookies
 */
export async function updateSession(request: NextRequest) {
  // Start with a normal response we'll return (we'll attach cookies to it if needed)
  let supabaseResponse = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // read cookies from the incoming request
        getAll() {
          return request.cookies.getAll();
        },

        // when Supabase asks us to set cookies, we're going to attach them to the NextResponse
        setAll(cookiesToSet) {
          // create a fresh response to attach cookies to (mirror NextResponse.next)
          supabaseResponse = NextResponse.next();

          // Attach each cookie to the response. `options` is optional but pass it when present.
          cookiesToSet.forEach(({ name, value, options }) => {
            // NextResponse.cookies.set supports the options object similar to Supabase output
            // Note: Keep options only to those allowed by Next.js (path, maxAge, httpOnly, secure, sameSite, domain).
            try {
              supabaseResponse.cookies.set(name, value, options ?? {});
            } catch (err) {
              // swallow cookie set errors silently — we don't want the middleware to crash
              // but we log for diagnostics in server logs.
              // eslint-disable-next-line no-console
              console.error("Failed to set cookie on response in middleware:", err);
            }
          });
        },

        // No need to implement deleteAll here; setAll covers the usual server flow.
      },
    }
  );

  // Optionally check the current user — we redirect to login for protected routes.
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only redirect to login for protected routes
    if (!user && (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/account"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    // In case of any Supabase error, don't crash the whole middleware; return the response.
    // eslint-disable-next-line no-console
    console.error("Error in supabase middleware getUser:", err);
  }

  return supabaseResponse;
}
