import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
      <h1 className="mb-4 text-xl font-semibold">Profil Saya</h1>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Nama</dt><dd>{user.name}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd>{user.email}</dd></div>
        <div className="flex justify-between"><dt className="text-gray-500">Role</dt><dd className="uppercase">{user.role}</dd></div>
      </dl>
    </div>
  );
}