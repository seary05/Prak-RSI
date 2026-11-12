import { useState, type FormEvent } from "react";
import { toApiError, type ApiError } from "../../api/apiError";
import FormField from "../common/FormField";
import type { StallInput } from "../../types/stall";

interface Props {
  initial?: Partial<StallInput>;
  submitLabel: string;
  onSubmit: (values: StallInput) => Promise<void>;
}

export default function StallForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        category: category.trim() || undefined,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      });
    } catch (err) {
      setError(toApiError(err)); // 400 -> fieldErrors, 403 -> pesan akses, dst.
    } finally {
      setSubmitting(false);
    }
  }

  const hasFieldErrors = !!error && Object.keys(error.fieldErrors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && !hasFieldErrors && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
          {error.message}
        </p>
      )}
      <FormField label="Nama warung" name="name" value={name} onChange={(e) => setName(e.target.value)} error={error?.fieldErrors.name} placeholder="Contoh: Bakso Pak Slamet" />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Kategori" name="category" value={category} onChange={(e) => setCategory(e.target.value)} error={error?.fieldErrors.category} placeholder="Contoh: Makanan Berat" />
        <FormField label="Lokasi" name="location" value={location} onChange={(e) => setLocation(e.target.value)} error={error?.fieldErrors.location} placeholder="Contoh: Kantin Pusat, Blok A" />
      </div>
      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">Deskripsi</label>
        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ceritakan tentang warung ini..."
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-muted/60 focus:ring-4 ${
            error?.fieldErrors.description
              ? "border-rose-400 focus:ring-rose-100"
              : "border-line focus:border-brand-400 focus:ring-brand-100"
          }`}
        />
        {error?.fieldErrors.description && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{error.fieldErrors.description}</p>
        )}
      </div>
      <button
        disabled={submitting}
        className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {submitting ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}