interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Sebelumnya
      </button>
      <span className="text-sm text-gray-600">Halaman {page} dari {totalPages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Berikutnya
      </button>
    </nav>
  );
}