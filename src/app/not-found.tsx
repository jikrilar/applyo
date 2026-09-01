import Link from "next/link";
export default function NotFound() { return <main className="error-page"><section className="error-card"><span>Halaman tidak ditemukan</span><h1>Ups, halaman ini mengambil jalan lain.</h1><p>Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.</p><Link className="button" href="/">Kembali ke Applyo</Link></section></main>; }
