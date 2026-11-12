import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { stallApi } from "../api/stallApi";
import { toApiError } from "../api/apiError";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/toast";
import { useStaggerIn } from "../lib/motion";
import { canDeleteStall, canEditStall } from "../utils/permissions";
import { stallVisual } from "../utils/stallVisual";
import Icon from "../components/common/Icon";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function StallDetailPage() {
  const { id } = useParams();
  const stallId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: stall, loading, error, reload } = useFetch(
    (signal) => stallApi.detail(stallId, signal),
    [stallId]
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const scopeRef = useRef<HTMLDivElement>(null);
  useStaggerIn(scopeRef, "[data-reveal]", [stall?.id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await stallApi.remove(stallId);
      toast.success("Warung berhasil dihapus");
      navigate("/");
    } catch (err) {
      toast.error(toApiError(err).message); // mis. 403 dari backend
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <Spinner label="Memuat detail warung..." />;

  if (error) {
    if (error.status === 404) {
      return (
        <EmptyState
          emoji="🕵️"
          title="Warung tidak ditemukan"
          description="Warung yang Anda cari tidak ada atau sudah dihapus."
          action={
            <Link to="/" className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Kembali ke daftar
            </Link>
          }
        />
      );
    }
    return <ErrorState error={error} onRetry={reload} />;
  }

  if (!stall) return null;
  const { emoji, gradient } = stallVisual(stall);

  return (
    <div ref={scopeRef} className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand-600"
      >
        <Icon name="arrow-left" className="h-4 w-4" /> Kembali ke daftar
      </Link>

      <div data-reveal className={`grid h-52 place-items-center rounded-3xl bg-linear-to-br ${gradient} sm:h-64`}>
        <span className="text-8xl sm:text-9xl">{emoji}</span>
      </div>

      <div data-reveal className="relative -mt-10 rounded-3xl border border-line bg-white p-6 shadow-card sm:mx-6 sm:p-8">
        {stall.category && (
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            {stall.category}
          </span>
        )}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">{stall.name}</h1>
        {stall.location && (
          <p className="mt-2 flex items-center gap-1.5 text-muted">
            <Icon name="pin" className="h-4 w-4" /> {stall.location}
          </p>
        )}

        <div className="my-6 h-px bg-line" />

        <h2 className="text-sm font-bold uppercase tracking-wide text-muted">Tentang warung</h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed">
          {stall.description || "Belum ada deskripsi."}
        </p>

        {(canEditStall(user, stall) || canDeleteStall(user)) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {canEditStall(user, stall) && (
              <Link
                to={`/stalls/${stall.id}/edit`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-700 active:scale-95"
              >
                <Icon name="edit" className="h-4 w-4" /> Edit
              </Link>
            )}
            {canDeleteStall(user) && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95"
              >
                <Icon name="trash" className="h-4 w-4" /> Hapus
              </button>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus warung?"
        message={`Warung "${stall.name}" akan dihapus permanen.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}