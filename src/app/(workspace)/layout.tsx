import { AppShell } from "@/components/app-shell";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/masuk");
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
  const displayName = profile?.display_name ?? String(user.user_metadata.display_name ?? user.email?.split("@")[0] ?? "Pengguna Applyo");
  const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AP";
  return <AppShell profile={{ displayName, email: user.email ?? "", initials }}>{children}</AppShell>;
}
