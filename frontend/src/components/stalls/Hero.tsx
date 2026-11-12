import Icon from "../common/Icon";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function Hero({ value, onChange }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 via-brand-600 to-brand-500 px-6 py-10 text-white shadow-lift sm:px-12 sm:py-14">
      {/* dekorasi latar */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-60 w-60 rounded-full bg-sky-200/25 blur-3xl" />

      <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-4">
        <div className="relative z-10 max-w-xl">
          <p data-hero className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
            🍴 Sistem Review Kantin
          </p>
          <h1 data-hero className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Lapar? Temukan <span className="text-sky-100">warung favoritmu</span> di sini.
          </h1>
          <p data-hero className="mt-3 text-base text-white sm:text-lg">
            Cari, lihat detail, dan kelola warung kantin dalam satu tempat.
          </p>

          <div data-hero className="mt-5 flex flex-wrap gap-2" aria-label="Fitur pencarian warung">
            <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:text-sm">
              🔎 Cari warung
            </span>
            <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:text-sm">
              🏷️ Filter kategori
            </span>
            <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:text-sm">
              ⭐ Baca ulasan
            </span>
          </div>

          <div data-hero className="relative mt-7">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="search" />
            </span>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Cari nama warung..."
              maxLength={100}
              aria-label="Cari warung"
              className="w-full rounded-full bg-white py-3.5 pl-12 pr-12 text-ink shadow-xl outline-none ring-4 ring-transparent transition placeholder:text-muted/70 focus:ring-sky-200/70"
            />
            {value && (
              <button
                onClick={() => onChange("")}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:bg-brand-50"
              >
                <Icon name="x" className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="relative mx-auto grid h-64 w-full max-w-sm place-items-center sm:h-72 md:h-80" aria-hidden="true">
          <div className="absolute h-52 w-52 rounded-full bg-white/10 blur-2xl sm:h-64 sm:w-64" />
          <div className="absolute h-44 w-44 rounded-full border border-white/20 bg-white/10 sm:h-56 sm:w-56" />
          <div data-float className="relative grid h-36 w-36 place-items-center rounded-[2.5rem] border border-white/40 bg-white/20 text-7xl shadow-2xl shadow-brand-900/20 backdrop-blur-md sm:h-44 sm:w-44 sm:text-8xl">
            🍜
          </div>
          <span data-float className="absolute left-6 top-8 grid h-16 w-16 place-items-center rounded-2xl border border-white/50 bg-white/90 text-3xl shadow-lg sm:left-4 sm:top-10">
            🥤
          </span>
          <span data-float className="absolute bottom-8 right-6 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl border border-white/50 bg-amber-100 text-4xl shadow-lg sm:bottom-10 sm:right-4">
            🍛
          </span>
          <span className="absolute bottom-8 left-4 rounded-full border border-white/30 bg-brand-800/35 px-4 py-2 text-sm font-bold shadow-lg backdrop-blur sm:bottom-10 sm:left-0">
            Temukan menu favoritmu
          </span>
        </div>
      </div>
    </section>
  );
}