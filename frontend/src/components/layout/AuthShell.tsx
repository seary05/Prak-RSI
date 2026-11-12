import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-line bg-white shadow-card md:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-brand-700 via-brand-600 to-sky-400 p-10 text-white md:flex">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-sky-200/30 blur-2xl" />
        <div className="relative">
          <span className="text-6xl">🍜</span>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight">
            Selamat datang di KantinReview
          </h2>
          <p className="mt-3 text-white">
            Temukan dan kelola warung kantin favoritmu dalam satu tempat.
          </p>
        </div>
        <div className="relative flex gap-3 text-3xl" aria-hidden="true">
          <span>🥤</span><span>🍛</span><span>🍗</span><span>🍰</span>
        </div>
      </aside>

      <div className="p-6 sm:p-10">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}