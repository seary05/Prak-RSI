interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  const btn =
    "rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold transition hover:border-brand-300 hover:text-brand-600 disabled:pointer-events-none disabled:opacity-40";
  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} className={btn}>
        ← Sebelumnya
      </button>
      <span className="rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
        {page} / {totalPages}
      </span>
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages} className={btn}>
        Berikutnya →
      </button>
    </nav>
  );
}