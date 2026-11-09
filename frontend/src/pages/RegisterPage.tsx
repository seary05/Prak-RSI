import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toApiError, type ApiError } from "../api/apiError";
import FormField from "../components/common/FormField";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
    <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Register</h1>
      {error && Object.keys(error.fieldErrors).length === 0 && (
        <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700" role="alert">{error.message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nama" name="name" value={form.name} onChange={set("name")} error={error?.fieldErrors.name} required />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={set("email")} error={error?.fieldErrors.email} required />
        <FormField label="Password" name="password" type="password" value={form.password} onChange={set("password")} error={error?.fieldErrors.password} required />
        <button disabled={submitting} className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Memproses..." : "Daftar"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}