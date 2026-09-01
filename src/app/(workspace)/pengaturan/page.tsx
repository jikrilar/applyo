import type { Metadata } from "next";
import { SettingsForm } from "@/components/settings-form";
import { getCurrentAccount } from "@/backend/services/account";
import { getPreferences } from "@/backend/services/preferences";
import { getStages } from "@/backend/services/stages";
export const metadata: Metadata = { title: "Pengaturan | Applyo" };
export default async function SettingsPage() { const [account, preferences, stages] = await Promise.all([getCurrentAccount(), getPreferences(), getStages()]); return <div className="settings-page"><header className="workspace-page-header"><div><span>Preferensi ruang kerja</span><h1>Pengaturan</h1><p>Kelola profil, format, dan tampilan papan.</p></div></header><SettingsForm account={account} preferences={preferences} stages={stages} /></div>; }
