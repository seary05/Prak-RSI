import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-brand-50 text-5xl">🍽️</div>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-brand-600">Error 404</p>
      <h1 className="mt-1 text-2xl font-extrabold">Halaman tidak ditemukan</h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">Sepertinya piringnya kosong. Halaman yang Anda cari tidak ada.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
        Kembali ke beranda
      </Link>
    </div>
  );
}