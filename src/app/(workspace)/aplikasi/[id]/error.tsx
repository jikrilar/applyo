"use client";
export default function ApplicationDetailError({ reset }: { error: Error; reset: () => void }) {
  return <section className="calendar-empty" role="alert"><strong>Detail lamaran tidak dapat dimuat.</strong><p>Coba muat ulang. Data Anda tidak berubah.</p><button className="button" onClick={reset}>Coba lagi</button></section>;
}
