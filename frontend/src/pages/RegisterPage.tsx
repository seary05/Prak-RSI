import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toApiError, type ApiError } from "../api/apiError";
import FormField from "../components/common/FormField";
import AuthShell from "../components/layout/AuthShell";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Buat akun baru"
      subtitle="Gratis dan cuma butuh beberapa detik."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">Login</Link>
        </>
      }
    >
      {error && Object.keys(error.fieldErrors).length === 0 && (
        <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">{error.message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nama" name="name" value={form.name} onChange={set("name")} error={error?.fieldErrors.name} placeholder="Nama lengkap" />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={set("email")} error={error?.fieldErrors.email} placeholder="nama@email.com" />
        <FormField label="Password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={set("password")} error={error?.fieldErrors.password} placeholder="Minimal 8 karakter" />
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
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? "Memproses..." : "Daftar"}
        </button>
      </form>
    </AuthShell>
  );
}