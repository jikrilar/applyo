"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarDays, Check, GripVertical } from "lucide-react";

const stages = [
  { name: "Incaran", color: "var(--purple)" },
  { name: "Dilamar", color: "var(--blue)" },
  { name: "Wawancara", color: "var(--pink)" },
] as const;

const jobs = [
  { id: 1, company: "Northstar Studio", role: "Desainer Produk", stage: 0 },
  { id: 2, company: "Pine Labs", role: "Frontend Engineer", stage: 1 },
  { id: 3, company: "Mori Health", role: "Peneliti UX", stage: 2 },
] as const;

export function KanbanDemo() {
  const [moved, setMoved] = useState(false);
  const reduceMotion = useReducedMotion();

  const moveApplication = () => setMoved((current) => !current);

  return (
    <div className="board-shell" aria-label="Pratinjau interaktif papan lamaran kerja">
      <div className="board-toolbar">
        <div>
          <span className="board-title">Lamaran saya</span>
          <span className="board-count">3 aktif</span>
        </div>
        <button className="mini-button" type="button" onClick={moveApplication}>
          {moved ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          {moved ? "Dipindahkan" : "Pindahkan kartu"}
        </button>
      </div>

      <div className="board-columns">
        {stages.map((stage, stageIndex) => {
          const stageJobs = jobs.filter((job) => {
            if (job.id === 2) return moved ? stageIndex === 2 : stageIndex === 1;
            return job.stage === stageIndex;
          });

          return (
            <section className="board-column" key={stage.name}>
              <header style={{ background: stage.color }}>
                <span>{stage.name}</span>
                <span>{stageJobs.length}</span>
              </header>
              <div className="card-stack">
                <AnimatePresence mode="popLayout">
                  {stageJobs.map((job) => (
                    <motion.article
                      layout
                      key={job.id}
                      initial={{ opacity: 0, y: 10, rotate: -1 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 24 }}
                      className="job-card"
                    >
                      <div className="job-card-top">
                        <strong>{job.company}</strong>
                        <GripVertical aria-hidden="true" />
                      </div>
                      <p>{job.role}</p>
                      <span className="job-date">
                        <CalendarDays aria-hidden="true" />
                        {job.id === 3 ? "Wawancara hari Kamis" : "Baru diperbarui"}
                      </span>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
