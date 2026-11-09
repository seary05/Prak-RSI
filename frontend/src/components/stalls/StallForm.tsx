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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && !hasFieldErrors && (
        <p className="rounded bg-red-50 p-2 text-sm text-red-700" role="alert">{error.message}</p>
      )}
      <FormField label="Nama warung" name="name" value={name} onChange={(e) => setName(e.target.value)} error={error?.fieldErrors.name} />
      <FormField label="Kategori" name="category" value={category} onChange={(e) => setCategory(e.target.value)} error={error?.fieldErrors.category} />
      <FormField label="Lokasi" name="location" value={location} onChange={(e) => setLocation(e.target.value)} error={error?.fieldErrors.location} />
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${error?.fieldErrors.description ? "border-red-500" : "border-gray-300"}`}
        />
        {error?.fieldErrors.description && <p className="mt-1 text-xs text-red-600">{error.fieldErrors.description}</p>}
      </div>
      <button disabled={submitting} className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60">
        {submitting ? "Menyimpan..." : submitLabel}
      </button>
    </form>
  );
}