"use client";

import { useState } from "react";
import { Check, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import type { StageDTO } from "@/backend/dto";

const stageColors: Record<string, string> = {
  wishlist: "var(--purple)",
  applied: "var(--blue)",
  screening: "var(--yellow)",
  interview: "var(--pink)",
  assessment: "var(--orange)",
  offer: "var(--green)",
};

const color = (stage: StageDTO) => stageColors[stage.systemKey ?? ""] ?? "var(--yellow)";

export type ApplicationFilterSelection = {
  stageIds: string[];
  locations: string[];
};

type ApplicationToolbarProps = {
  query: string;
  stages: StageDTO[];
  locations: string[];
  stageFilter: string[];
  locationFilter: string[];
  onQueryChange: (query: string) => void;
  onFiltersChange: (selection: ApplicationFilterSelection) => void;
  onAdd: () => void;
};

export function ApplicationToolbar({
  query,
  stages,
  locations,
  stageFilter,
  locationFilter,
  onQueryChange,
  onFiltersChange,
  onAdd,
}: ApplicationToolbarProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftStages, setDraftStages] = useState<string[]>(stageFilter);
  const [draftLocations, setDraftLocations] = useState<string[]>(locationFilter);
  const activeFilters = stageFilter.length + locationFilter.length;

  const openFilters = () => {
    setDraftStages(stageFilter);
    setDraftLocations(locationFilter);
    setFilterOpen((current) => !current);
  };
  const clearFilters = () => {
    setDraftStages([]);
    setDraftLocations([]);
    onFiltersChange({ stageIds: [], locations: [] });
  };
  const applyFilters = () => {
    onFiltersChange({ stageIds: draftStages, locations: draftLocations });
    setFilterOpen(false);
  };

  return (
    <div className="workspace-toolbar application-toolbar">
      <label className="workspace-search">
        <Search aria-hidden="true" />
        <span className="sr-only">Cari lamaran</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Cari perusahaan atau posisi..."
        />
      </label>
      <div className="filter-control">
        <button
          className={`filter-button${activeFilters ? "has-filters" : ""}`}
          type="button"
          aria-expanded={filterOpen}
          onClick={openFilters}
        >
          <SlidersHorizontal aria-hidden="true" /> Filter
          {activeFilters > 0 && <span className="filter-count">{activeFilters}</span>}
        </button>
        {filterOpen && (
          <div className="filter-popover">
            <header>
              <strong>Filter lamaran</strong>
              <button type="button" aria-label="Tutup filter" onClick={() => setFilterOpen(false)}>
                <X />
              </button>
            </header>
            <fieldset>
              <legend>Tahap</legend>
              <div className="filter-options">
                {stages.map((stage) => (
                  <label key={stage.id}>
                    <input
                      type="checkbox"
                      checked={draftStages.includes(stage.id)}
                      onChange={() =>
                        setDraftStages((value) =>
                          value.includes(stage.id)
                            ? value.filter((id) => id !== stage.id)
                            : [...value, stage.id],
                        )
                      }
                    />
                    <span>
                      <i style={{ background: color(stage) }} />
                      {stage.name}
                      <Check />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Lokasi</legend>
              {locations.length ? (
                <div className="filter-options location-filter-options">
                  {locations.map((location) => (
                    <label key={location}>
                      <input
                        type="checkbox"
                        checked={draftLocations.includes(location)}
                        onChange={() =>
                          setDraftLocations((value) =>
                            value.includes(location)
                              ? value.filter((item) => item !== location)
                              : [...value, location],
                          )
                        }
                      />
                      <span>
                        {location}
                        <Check />
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="filter-empty">Belum ada lokasi yang tercatat.</p>
              )}
            </fieldset>
            <div className="filter-actions">
              <button className="filter-button" type="button" onClick={clearFilters}>
                Hapus filter
              </button>
              <button className="button" type="button" onClick={applyFilters}>
                Terapkan filter
              </button>
            </div>
          </div>
        )}
      </div>
      <button className="button" type="button" onClick={onAdd}>
        <Plus aria-hidden="true" /> Tambah lamaran
      </button>
    </div>
  );
}
