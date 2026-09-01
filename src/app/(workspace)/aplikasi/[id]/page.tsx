import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getApplicationDetail, getApplicationStages } from "@/backend/services/queries";
import { getPreferences } from "@/backend/services/preferences";
import { ApplicationDetail } from "@/components/application-detail/application-detail";

export const metadata: Metadata = { title: "Detail Lamaran | Applyo" };
export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!/^[0-9a-f-]{36}$/i.test(id)) notFound(); const [detail, stages, preferences] = await Promise.all([getApplicationDetail(id), getApplicationStages(), getPreferences()]); if (!detail) notFound(); return <ApplicationDetail initialDetail={detail} stages={stages} preferences={preferences} />; }
