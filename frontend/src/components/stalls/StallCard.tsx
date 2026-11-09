import { Link } from "react-router-dom";
import type { Stall } from "../../types/stall";

export default function StallCard({ stall }: { stall: Stall }) {
  return (
    <Link
      to={`/stalls/${stall.id}`}
      className="block rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-lg font-semibold">{stall.name}</h3>
      {stall.category && (
        <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{stall.category}</span>
      )}
      {stall.location && <p className="mt-2 text-sm text-gray-500">📍 {stall.location}</p>}
      {stall.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{stall.description}</p>}
    </Link>
  );
}