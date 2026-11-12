import type { Role } from "../../types/auth";

const styles: Record<Role, string> = {
  admin: "bg-rose-100 text-rose-700",
  owner: "bg-amber-100 text-amber-800",
  customer: "bg-emerald-100 text-emerald-700",
};

export default function RoleBadge({ role }: { role: Role }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[role]}`}>
      {role}
    </span>
  );
}