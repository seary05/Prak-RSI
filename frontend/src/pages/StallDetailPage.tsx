import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { stallApi } from "../api/stallApi";
import { toApiError } from "../api/apiError";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/toast";
import { canDeleteStall, canEditStall } from "../utils/permissions";
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
          title="Warung tidak ditemukan"
          description="Warung yang Anda cari tidak ada atau sudah dihapus."
          action={<Link to="/" className="text-blue-600 hover:underline">Kembali ke daftar</Link>}
        />
      );
    }
    return <ErrorState error={error} onRetry={reload} />;
  }

  if (!stall) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <Link to="/" className="text-sm text-blue-600 hover:underline">← Kembali</Link>
      <h1 className="mt-2 text-2xl font-bold">{stall.name}</h1>
      {stall.category && <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">{stall.category}</span>}
      {stall.location && <p className="mt-3 text-gray-600">📍 {stall.location}</p>}
      <p className="mt-3 whitespace-pre-line text-gray-700">{stall.description || "Belum ada deskripsi."}</p>

      <div className="mt-6 flex gap-2">
        {canEditStall(user, stall) && (
          <Link to={`/stalls/${stall.id}/edit`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Edit</Link>
        )}
        {canDeleteStall(user) && (
          <button onClick={() => setConfirmOpen(true)} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">Hapus</button>
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