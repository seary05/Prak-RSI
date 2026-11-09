import type { ApiError } from "../../api/apiError";

interface Props {
  error: ApiError;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: Props) {
  const title =
    error.status === 403
      ? "Anda tidak punya akses"
      : error.isNetworkError
      ? "Gagal terhubung ke server"
      : "Terjadi kesalahan";

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center" role="alert">
      <p className="text-lg font-semibold text-red-700">{title}</p>
      <p className="mt-1 text-sm text-red-600">{error.message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
          Coba lagi
        </button>
      )}
    </div>
  );
}