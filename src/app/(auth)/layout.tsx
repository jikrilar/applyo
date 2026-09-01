import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <header className="auth-nav">
        <Link className="wordmark" href="/">Apply<span>o</span></Link>
        <ThemeToggle />
      </header>
      <div className="auth-layout">
        <section className="auth-panel">{children}</section>
        <aside className="auth-story" aria-label="Manfaat Applyo">
          <div className="auth-story-copy">
            <span className="auth-sticker">Rapi sejak lamaran pertama</span>
            <h2>Satu tempat untuk setiap peluang.</h2>
            <p>Pantau tahap, jadwal, dan tindak lanjut tanpa merawat spreadsheet lain.</p>
          </div>
          <div className="auth-progress" aria-hidden="true">
            <div className="progress-card progress-one"><CheckCircle2 /> Lowongan disimpan</div>
            <div className="progress-card progress-two"><CheckCircle2 /> Lamaran dikirim</div>
            <div className="progress-card progress-three"><CheckCircle2 /> Wawancara dijadwalkan</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
