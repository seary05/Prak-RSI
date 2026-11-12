import { useRef, useState } from "react";
import { stallApi } from "../api/stallApi";
import { useFetch } from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { useHeroIntro, useStaggerIn } from "../lib/motion";
import Hero from "../components/stalls/Hero";
import CategoryChips from "../components/stalls/CategoryChips";
import StallCard from "../components/stalls/StallCard";
import StallCardSkeleton from "../components/stalls/StallCardSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Pagination from "../components/common/Pagination";

const LIMIT = 9;

export default function StallListPage() {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput.trim(), 400);

  const { data, loading, error, reload } = useFetch(
    (signal) =>
      stallApi.list(
        {
          search: search || undefined,
          category: category || undefined,
          page,
          limit: LIMIT,
        },
        signal
      ),
    [search, category, page]
  );

  // Animasi GSAP (otomatis tidak aktif bila gsap tidak dipasang)
  const pageRef = useRef<HTMLDivElement>(null);
  useHeroIntro(pageRef);
  useStaggerIn(pageRef, "[data-reveal]", [data?.items]);

  const hasFilter = !!(search || category);

  function resetFilters() {
    setSearchInput("");
    setCategory("");
    setPage(1);
  }

  return (
    <div ref={pageRef} className="space-y-8">
      <Hero
        value={searchInput}
        onChange={(v) => {
          setSearchInput(v);
          setPage(1);
        }}
      />

      <CategoryChips
        value={category}
        onChange={(v) => {
          setCategory(v);
          setPage(1);
        }}
      />

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-extrabold">{hasFilter ? "Hasil pencarian" : "Semua warung"}</h2>
          {!loading && !error && typeof data?.pagination?.total === "number" && (
            <span className="text-sm text-muted">{data.pagination.total} warung</span>
          )}
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Memuat daftar warung">
            {Array.from({ length: 6 }).map((_, i) => (
              <StallCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && <ErrorState error={error} onRetry={reload} />}

        {!loading && !error && data && data.items.length === 0 && (
          <EmptyState
            emoji={hasFilter ? "🔍" : "🍽️"}
            title={hasFilter ? "Tidak ada warung yang cocok" : "Belum ada warung"}
            description={
              hasFilter
                ? "Coba ubah kata kunci atau pilih kategori lain."
                : "Warung akan tampil di sini setelah ditambahkan."
            }
            action={
              hasFilter && (
                <button
                  onClick={resetFilters}
                  className="rounded-full border border-brand-200 px-5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  Reset filter
                </button>
              )
            }
          />
        )}

        {!loading && !error && data && data.items.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((s) => (
                <StallCard key={s.id} stall={s} />
              ))}
            </div>
            <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}