import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({ label, error, id, ...rest }: Props) {
  const inputId = id ?? rest.name;
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:ring-4 ${
          error
            ? "border-rose-400 focus:ring-rose-100"
            : "border-line focus:border-brand-400 focus:ring-brand-100"
        }`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}