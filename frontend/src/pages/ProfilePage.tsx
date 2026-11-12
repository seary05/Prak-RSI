import { useAuth } from "../hooks/useAuth";
import RoleBadge from "../components/common/RoleBadge";

export default function ProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="h-24 bg-linear-to-br from-brand-700 via-brand-600 to-brand-500" />
      <div className="px-6 pb-8">
        <div className="-mt-10 grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-brand-100 text-3xl font-extrabold text-brand-700">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-3 text-2xl font-extrabold">{user.name}</h1>
        <div className="mt-1"><RoleBadge role={user.role} /></div>

        <dl className="mt-6 divide-y divide-line rounded-2xl border border-line text-sm">
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Email</dt>
            <dd className="truncate font-semibold">{user.email}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Role</dt>
            <dd className="font-semibold capitalize">{user.role}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}