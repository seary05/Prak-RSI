import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/toast";
import { toApiError, type ApiError } from "../api/apiError";
import { SESSION_EXPIRED_KEY } from "../api/axiosClient";
import FormField from "../components/common/FormField";
import AuthShell from "../components/layout/AuthShell";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [expired] = useState(() => {
    const flag = sessionStorage.getItem(SESSION_EXPIRED_KEY) === "1";
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);
    return flag;
  });

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";
  const justRegistered = (location.state as { registered?: boolean } | null)?.registered;

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email: email.trim(), password });
      toast.success("Login berhasil");
      navigate(from, { replace: true });
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Masuk ke akunmu"
      subtitle="Login untuk mengelola warung atau memberi review."
      footer={
        <>
          Belum punya akun?{" "}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">Daftar sekarang</Link>
        </>
      }
    >
      {expired && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">Sesi Anda berakhir. Silakan login kembali.</p>}
      {justRegistered && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Registrasi berhasil. Silakan login.</p>}
      {error && <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700" role="alert">{error.message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error?.fieldErrors.email} placeholder="nama@email.com" />
        <FormField label="Password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} error={error?.fieldErrors.password} placeholder="••••••••" />
        <button
          type="button"
          aria-controls="password"
          aria-pressed={showPassword}
          onClick={() => setShowPassword((visible) => !visible)}
          className="-mt-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {showPassword ? "Sembunyikan password" : "Tampilkan password"}
        </button>
        <div className="-mt-2 text-right">
          <Link to="/forgot-password" className="text-sm font-semibold text-brand-700 hover:text-brand-800 hover:underline">
            Lupa password?
          </Link>
        </div>
        <button
          disabled={submitting}
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? "Memproses..." : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}