import type { ApiError } from "../../api/apiError";
import Icon from "./Icon";

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
    <div className="rounded-3xl border border-rose-200 bg-rose-50 px-6 py-12 text-center" role="alert">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-rose-600">
        <Icon name="alert" className="h-7 w-7" />
      </div>
      <p className="mt-4 text-lg font-bold text-rose-800">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-rose-700">{error.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-95"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}