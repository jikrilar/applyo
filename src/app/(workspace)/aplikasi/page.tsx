import type { Metadata } from "next";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { ApplicationWorkspace } from "@/components/application-workspace";
import { ApplicationList } from "@/components/application-list/application-list";
import { getApplicationStages, getBoard, searchApplications } from "@/backend/services/queries";
import { getPreferences } from "@/backend/services/preferences";

export const metadata: Metadata = { title: "Lamaran | Applyo" };

type SearchParam = string | string[];
type Params = {
  view?: string;
  query?: string;
  stageId?: SearchParam;
  location?: SearchParam;
  outcome?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  archived?: string;
  sort?: string;
  offset?: string;
};
export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const listView = params.view === "list";
  const pageSize = 20;
  const archived = params.archived === "true";
  const filters = {
    query: params.query || undefined,
    stageId: params.stageId || undefined,
    location: params.location || undefined,
    outcome: params.outcome || undefined,
    source: params.source || undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
    archived,
    sort: params.sort || undefined,
    limit: pageSize,
    offset: Number(params.offset) || 0,
  };
  const [board, preferences, stages, results] = await Promise.all([
    getBoard(),
    getPreferences(),
    getApplicationStages(),
    listView ? searchApplications(filters) : Promise.resolve(null),
  ]);
  const locations = [
    ...new Set(
      board.stages
        .flatMap((stage) => board.cardsByStage[stage.id] ?? [])
        .flatMap((application) => (application.location ? [application.location] : [])),
    ),
  ].sort();
  return (
    <div className="applications-page">
      <header className="workspace-page-header applications-header">
        <div>
          <span>Ruang kerja lamaran</span>
          <h1>Lamaran saya</h1>
          <p>
            {listView
              ? "Cari dan tinjau seluruh riwayat lamaran."
              : "Pindahkan setiap kartu saat proses rekrutmen berkembang."}
          </p>
        </div>
        <nav className="application-view-switch" aria-label="Tampilan lamaran">
          <Link
            className={!listView ? "active" : ""}
            aria-current={!listView ? "page" : undefined}
            href="/aplikasi"
          >
            <LayoutGrid /> Papan
          </Link>
          <Link
            className={listView ? "active" : ""}
            aria-current={listView ? "page" : undefined}
            href="/aplikasi?view=list"
          >
            <List /> Daftar
          </Link>
        </nav>
      </header>
      {listView && results ? (
        <ApplicationList
          items={results.items}
          total={results.total}
          stages={board.stages}
          locations={locations}
          params={params}
          pageSize={pageSize}
        />
      ) : (
        <ApplicationWorkspace
          initialBoard={board}
          timezone={preferences.timezone}
          currency={preferences.currency}
          stages={stages}
        />
      )}
    </div>
  );
}
