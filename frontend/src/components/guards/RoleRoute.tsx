import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Spinner from "../common/Spinner";
import ForbiddenPage from "../../pages/ForbiddenPage";
import type { Role } from "../../types/auth";

// Tanpa `roles` = cukup login. Dengan `roles` = harus login DAN role cocok.
export default function RoleRoute({ roles }: { roles?: Role[] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner label="Memeriksa sesi..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <ForbiddenPage />;
  return <Outlet />;
}