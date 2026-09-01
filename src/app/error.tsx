"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="error-page">
      <div className="error-card">
        <span>Ada yang tersendat.</span>
        <h1>Applyo tidak dapat memuat halaman ini.</h1>
        <p>Lamaranmu tetap aman. Coba muat halaman ini lagi.</p>
        <button className="button" type="button" onClick={reset}>Coba lagi</button>
      </div>
    </main>
  );
}
