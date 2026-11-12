import { stallApi } from "../../api/stallApi";
import { useFetch } from "../../hooks/useFetch";
import { emojiFor } from "../../utils/stallVisual";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function CategoryChips({ value, onChange }: Props) {
  const { data, loading } = useFetch((signal) => stallApi.categories(signal), []);

  const categories = Array.isArray(data) ? data : [];

  // Jangan sembunyikan seluruh bar filter hanya karena data kategori kosong.
  // Pengguna tetap perlu opsi "Semua" agar filter tidak tampak hilang.
  const options = [
    { label: "Semua", value: "", emoji: "✨" },
    ...categories.map((c) => ({ label: c, value: c, emoji: emojiFor(c) })),
  ];

  return (
    <div
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      role="tablist"
      aria-label="Kategori"
    >
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 shrink-0 animate-pulse rounded-full bg-brand-100/60"
            />
          ))
        : options.map((c) => {
            const active = value === c.value;
            return (
              <button
                key={c.label}
                role="tab"
                aria-selected={active}
                onClick={() => onChange(c.value)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-500/25"
                    : "border-line bg-white hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                <span>{c.emoji}</span>
                {c.label}
              </button>
            );
          })}
    </div>
  );
}