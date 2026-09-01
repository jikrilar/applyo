import Link from "next/link";
export default function ApplicationNotFound() {
  return <section className="calendar-empty"><strong>Lamaran tidak ditemukan.</strong><p>Lamaran mungkin sudah dihapus atau tidak dapat Anda akses.</p><Link className="button" href="/aplikasi">Kembali ke lamaran</Link></section>;
}
