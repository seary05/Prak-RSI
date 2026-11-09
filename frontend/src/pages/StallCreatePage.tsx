import { useNavigate } from "react-router-dom";
import { stallApi } from "../api/stallApi";
import { useToast } from "../context/toast";
import StallForm from "../components/stalls/StallForm";

export default function StallCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Tambah Warung</h1>
      <StallForm
        submitLabel="Simpan"
        onSubmit={async (values) => {
          const created = await stallApi.create(values);
          toast.success("Warung berhasil ditambahkan");
          navigate(`/stalls/${created.id}`);
        }}
      />
    </div>
  );
}