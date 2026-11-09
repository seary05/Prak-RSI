import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/toast";
import { toApiError, type ApiError } from "../api/apiError";
import { SESSION_EXPIRED_KEY } from "../api/axiosClient";
import FormField from "../components/common/FormField";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="mx-auto max-w-sm rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Login</h1>

      {expired && <p className="mb-3 rounded bg-yellow-50 p-2 text-sm text-yellow-800">Sesi Anda berakhir. Silakan login kembali.</p>}
      {justRegistered && <p className="mb-3 rounded bg-green-50 p-2 text-sm text-green-800">Registrasi berhasil. Silakan login.</p>}
      {error && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700" role="alert">{error.message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error?.fieldErrors.email} required />
        <FormField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={error?.fieldErrors.password} required />
        <button disabled={submitting} className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
          {submitting ? "Memproses..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </div>
  );
}