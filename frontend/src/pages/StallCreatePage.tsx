import { Link, useNavigate } from "react-router-dom";
import { stallApi } from "../api/stallApi";
import { useToast } from "../context/toast";
import StallForm from "../components/stalls/StallForm";
import Icon from "../components/common/Icon";

export default function StallCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand-600">
        <Icon name="arrow-left" className="h-4 w-4" /> Kembali
      </Link>
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
        <h1 className="text-2xl font-extrabold">Tambah Warung</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Isi data warung baru yang ingin ditampilkan.</p>
        <StallForm
          submitLabel="Simpan Warung"
          onSubmit={async (values) => {
            const created = await stallApi.create(values);
            toast.success("Warung berhasil ditambahkan");
            navigate(`/stalls/${created.id}`);
          }}
        />
      </div>
    </div>
  );
}