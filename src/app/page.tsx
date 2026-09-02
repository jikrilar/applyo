import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  LayoutDashboard,
  MoveRight,
  Sparkles,
} from "lucide-react";
import { KanbanDemo } from "@/components/kanban-demo";
import { Reveal } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: LayoutDashboard,
    title: "Lihat setiap lamaran",
    copy: "Satu papan menampilkan lowongan yang kamu simpan, kirim, jadwalkan, dan selesaikan.",
    className: "feature-board",
  },
  {
    icon: BellRing,
    title: "Tahu apa yang perlu diperhatikan",
    copy: "Temukan lamaran tanpa kabar dan tindak lanjut mendatang sebelum terlewat.",
    className: "feature-reminder",
  },
  {
    icon: CalendarCheck,
    title: "Jaga jadwal tetap dekat",
    copy: "Wawancara dan asesmen tetap terhubung dengan lamaran yang berkaitan.",
    className: "feature-calendar",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Navigasi utama">
        <a className="wordmark" href="#top" aria-label="Beranda Applyo">
          Apply<span>o</span>
        </a>
        <div className="nav-links">
          <a href="#how-it-works">Cara kerja</a>
          <a href="#for-teams">Untuk tim</a>
          <ThemeToggle />
          <a className="button button-small" href="/masuk">
            Mulai pantau
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="hero-kicker">
            <Sparkles aria-hidden="true" /> Dibuat untuk pencari kerja
          </div>
          <h1>Kariermu terus maju.</h1>
          <p>
            Pantau setiap lamaran, tenggat, dan langkah berikutnya dalam satu ruang kerja yang
            ramah.
          </p>
          <div className="hero-actions">
            <a className="button" href="/masuk">
              Mulai pantau <ArrowRight aria-hidden="true" />
            </a>
            <a className="text-link" href="#how-it-works">
              Lihat cara kerja <MoveRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <KanbanDemo />
        </div>
      </section>

      <section className="problem-strip" aria-label="Masalah yang diselesaikan Applyo">
        <p>Lebih sedikit keruwetan spreadsheet.</p>
        <span aria-hidden="true">+</span>
        <p>Lebih jelas menentukan langkah berikutnya.</p>
      </section>

      <section className="workflow-section" id="how-it-works">
        <Reveal className="section-heading">
          <h2>Pencarianmu, dalam sekali lihat.</h2>
          <p>
            Applyo mengubah catatan yang tersebar menjadi alur jelas dari lowongan tersimpan hingga
            hasil akhir.
          </p>
        </Reveal>
        <div className="workflow-path" aria-label="Alur lamaran kerja">
          {[
            ["Simpan", "Kumpulkan lowongan yang menjanjikan."],
            ["Pantau", "Majukan setiap lamaran sesuai prosesnya."],
            ["Tindak lanjut", "Ingat tindakan berikutnya."],
            ["Tinjau", "Pahami apa yang berhasil."],
          ].map(([title, copy], index) => (
            <Reveal className="workflow-step" key={title}>
              <span className="step-number">{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              {index < 3 && <ArrowRight className="step-arrow" aria-hidden="true" />}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="features-section">
        <Reveal className="section-heading compact-heading">
          <h2>Semua punya tempat.</h2>
        </Reveal>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, copy, className }) => (
            <Reveal className={`feature-cell ${className}`} key={title}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="teams-section" id="for-teams">
        <Reveal className="teams-illustration" aria-hidden="true">
          <div className="shared-card shared-card-one">
            <CheckCircle2 /> Tinjauan kandidat
          </div>
          <div className="shared-card shared-card-two">
            <CheckCircle2 /> Catatan wawancara
          </div>
          <div className="shared-card shared-card-three">
            <CheckCircle2 /> Langkah berikutnya
          </div>
        </Reveal>
        <Reveal className="teams-copy">
          <h2>Berguna sendiri. Jelas bersama tim.</h2>
          <p>
            Pelatih karier dan tim pendamping dapat memberi arahan terfokus tanpa membuat ulang
            pencarian kerja di spreadsheet lain.
          </p>
          <a className="text-link" href="mailto:hello@applyo.app">
            Tanyakan fitur tim <ArrowRight aria-hidden="true" />
          </a>
        </Reveal>
      </section>

      <section className="cta-section" id="get-started">
        <div>
          <h2>Lamaran berikutnya layak punya tempat yang lebih baik.</h2>
          <p>
            Gratis untuk pencari kerja. Satukan seluruh pencarianmu dan selalu tahu langkah
            berikutnya.
          </p>
        </div>
        <a className="button" href="/masuk">
          Mulai pantau <ArrowRight aria-hidden="true" />
        </a>
      </section>

      <footer>
        <a className="wordmark" href="#top">
          Apply<span>o</span>
        </a>
        <p>Kariermu terus maju.</p>
        <a href="mailto:hello@applyo.app">hello@applyo.app</a>
      </footer>
    </main>
  );
}
