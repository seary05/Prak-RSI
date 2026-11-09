import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-bold text-gray-300">403</p>
      <h1 className="mt-2 text-xl font-semibold">Anda tidak punya akses ke halaman ini</h1>
      <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Kembali ke beranda</Link>
    </div>
  );
}