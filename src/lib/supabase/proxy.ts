import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getServerEnv } from "@/lib/env/server";
import type { Database } from "@/types/database";

const protectedRoutes = ["/dashboard", "/aplikasi", "/kalender", "/analitik", "/pengaturan"];
const authRoutes = ["/masuk", "/daftar"];

export async function updateSession(request: NextRequest) {
  const env = getServerEnv();
  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  const authenticated = Boolean(data?.claims?.sub);
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtected && !authenticated) {
    const target = request.nextUrl.clone();
    target.pathname = "/masuk";
    target.searchParams.set("next", request.nextUrl.pathname);
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }
  if (isAuth && authenticated) {
    const target = request.nextUrl.clone(); target.pathname = "/dashboard"; target.search = "";
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }
  return response;
}
