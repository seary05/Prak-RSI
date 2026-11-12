import { Link, useNavigate, useParams } from "react-router-dom";
import { stallApi } from "../api/stallApi";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/toast";
import { canEditStall } from "../utils/permissions";
import Spinner from "../components/common/Spinner";
import ErrorState from "../components/common/ErrorState";
import Icon from "../components/common/Icon";
import ForbiddenPage from "./ForbiddenPage";
import StallForm from "../components/stalls/StallForm";

export default function StallEditPage() {
  const { id } = useParams();
  const stallId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: stall, loading, error, reload } = useFetch(
    (signal) => stallApi.detail(stallId, signal),
    [stallId]
  );

  if (loading) return <Spinner label="Memuat data warung..." />;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (!stall) return null;

  // Cegah owner membuka form edit milik orang lain lewat URL manual.
  // (Backend tetap menolak dengan 403 jika ini terlewat.)
  if (!canEditStall(user, stall)) return <ForbiddenPage />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/stalls/${stallId}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand-600">
        <Icon name="arrow-left" className="h-4 w-4" /> Kembali ke detail
      </Link>
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <h1 className="text-2xl font-extrabold">Ubah Warung</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Perbarui informasi warung, lalu simpan.</p>
        <StallForm
          initial={{
            name: stall.name,
            category: stall.category ?? "",
            location: stall.location ?? "",
            description: stall.description ?? "",
          }}
          submitLabel="Simpan Perubahan"
          onSubmit={async (values) => {
            await stallApi.update(stallId, values);
            toast.success("Warung berhasil diperbarui");
            navigate(`/stalls/${stallId}`);
          }}
        />
      </div>
    </div>
  );
}