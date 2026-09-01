import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null, origin: string) {
  if (!value || value.includes("\\")) return "/dashboard";
  const target = new URL(value, origin);
  return target.origin === origin && target.pathname.startsWith("/") ? `${target.pathname}${target.search}` : "/dashboard";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext(url.searchParams.get("next"), url.origin), url.origin));
  }
  return NextResponse.redirect(new URL("/masuk?status=callback-gagal", url.origin));
}
