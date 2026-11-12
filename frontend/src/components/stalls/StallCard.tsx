import { Link } from "react-router-dom";
import type { Stall } from "../../types/stall";
import { stallVisual } from "../../utils/stallVisual";
import Icon from "../common/Icon";

export default function StallCard({ stall }: { stall: Stall }) {
  const { emoji, gradient } = stallVisual(stall);
  const reviewCount = stall.reviewCount ?? 0;
  const avgRating = stall.avgRating ?? 0;

  return (
    // Pembungkus luar dianimasikan GSAP; efek hover CSS ada di Link (agar tidak bentrok)
    <div data-reveal>
      <Link
        to={`/stalls/${stall.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
      >
        <div className={`relative grid h-36 place-items-center bg-linear-to-br ${gradient}`}>
          <span className="text-6xl transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
            {emoji}
          </span>
          {stall.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-700 backdrop-blur">
              {stall.category}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-extrabold leading-snug">{stall.name}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm" aria-label={
            reviewCount > 0
              ? `Rating ${avgRating.toFixed(1)} dari 5, ${reviewCount} ulasan`
              : "Belum ada ulasan"
          }>
            {reviewCount > 0 ? (
              <>
                <span aria-hidden="true" className="text-amber-500">★</span>
                <span className="font-bold text-ink">{avgRating.toFixed(1)}</span>
                <span className="text-muted">({reviewCount.toLocaleString("id-ID")} ulasan)</span>
              </>
            ) : (
              <span className="text-muted">Belum ada ulasan</span>
            )}
          </div>
          {stall.location && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <Icon name="pin" className="h-4 w-4 shrink-0" />
              <span className="truncate">{stall.location}</span>
            </p>
          )}
          {stall.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted">{stall.description}</p>
          )}
          <span className="mt-auto pt-4 text-sm font-bold text-brand-600">
            Lihat detail <span className="inline-block transition group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </div>
  );
}