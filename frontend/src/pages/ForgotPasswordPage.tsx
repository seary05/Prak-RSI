import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import { toApiError } from "../api/apiError";
import FormField from "../components/common/FormField";
import AuthShell from "../components/layout/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await authApi.forgotPassword(email.trim());
      setResetUrl(result.resetUrl ?? "");
      setSent(true);
    } catch (requestError) {
      setError(toApiError(requestError).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Lupa password?"
      subtitle="Masukkan email akunmu untuk menerima tautan reset password."
      footer={<Link to="/login" className="font-bold text-brand-600 hover:underline">Kembali ke login</Link>}
    >
      {sent ? (
        <>
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">
            Jika email terdaftar, tautan reset akan dikirim. Periksa kotak masuk emailmu.
          </p>
          {resetUrl && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Mode development: gunakan tautan reset ini.</p>
              <Link to={resetUrl.replace(/^https?:\/\/[^/]+/, "")} className="mt-2 block break-all font-medium underline">
                Atur ulang password
              </Link>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">{error}</p>}
          <FormField label="Email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" />
          <button
            disabled={submitting}
            className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Kirim tautan reset"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}