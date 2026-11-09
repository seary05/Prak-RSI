import { useState } from "react";
import { stallApi } from "../api/stallApi";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import StallCard from "../components/stalls/StallCard";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Pagination from "../components/common/Pagination";

const LIMIT = 9;

export default function StallListPage() {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput.trim(), 400);
  const debouncedCategory = useDebounce(category.trim(), 400);

  const { data, loading, error, reload } = useFetch(
    (signal) =>
      stallApi.list(
        {
          search: search || undefined,
          category: debouncedCategory || undefined,
          page,
          limit: LIMIT,
        },
        signal
      ),
    [search, debouncedCategory, page]
  );

  const hasFilter = !!(search || debouncedCategory);

  function resetFilters() {
    setSearchInput("");
    setCategory("");
    setPage(1);
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Daftar Warung</h1>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <input
          value={searchInput}
          onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
          placeholder="Cari nama warung..."
          maxLength={100}
          className="rounded-lg border px-3 py-2 text-sm"
          aria-label="Cari warung"
        />
        <input
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          placeholder="Filter kategori..."
          maxLength={50}
          className="rounded-lg border px-3 py-2 text-sm"
          aria-label="Filter kategori"
        />
      </div>

      {loading && <Spinner label="Memuat daftar warung..." />}

      {!loading && error && <ErrorState error={error} onRetry={reload} />}

      {!loading && !error && data && data.items.length === 0 && (
        <EmptyState
          title={hasFilter ? "Tidak ada warung yang cocok" : "Belum ada warung"}
          description={hasFilter ? "Coba ubah kata kunci atau filter." : "Warung akan tampil di sini setelah ditambahkan."}
          action={hasFilter && (
            <button onClick={resetFilters} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Reset filter</button>
          )}
        />
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((s) => <StallCard key={s.id} stall={s} />)}
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}