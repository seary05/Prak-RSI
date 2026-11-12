import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "../api/authApi";
import { toApiError } from "../api/apiError";
import FormField from "../components/common/FormField";
import AuthShell from "../components/layout/AuthShell";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await authApi.resetPassword({ token, password });
      setCompleted(true);
    } catch (requestError) {
      setError(toApiError(requestError).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Atur password baru"
      subtitle="Gunakan password minimal 8 karakter."
      footer={<Link to="/login" className="font-bold text-brand-600 hover:underline">Kembali ke login</Link>}
    >
      {completed ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
          Password berhasil diperbarui. Silakan login dengan password baru.
        </p>
      ) : !token ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">
          Tautan reset tidak valid. Minta tautan reset yang baru.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">{error}</p>}
          <FormField label="Password baru" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 8 karakter" />
          <button
            type="button"
            aria-controls="password"
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="-mt-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            {showPassword ? "Sembunyikan password" : "Tampilkan password"}
          </button>
          <button
            disabled={submitting}
            className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Memproses..." : "Simpan password baru"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}