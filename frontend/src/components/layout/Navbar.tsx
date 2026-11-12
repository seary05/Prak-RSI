import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/toast";
import { canCreateStall } from "../../utils/permissions";
import Icon from "../common/Icon";
import RoleBadge from "../common/RoleBadge";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  function handleLogout() {
    logout();
    toast.success("Anda telah logout");
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-400 to-brand-600 text-lg shadow-md shadow-brand-500/30">
            🍽️
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Kantin<span className="text-brand-600">Review</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {canCreateStall(user) && (
            <Link
              to="/stalls/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-700 active:scale-95"
            >
              <Icon name="plus" className="h-4 w-4" />
              <span className="hidden sm:inline">Tambah Warung</span>
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pl-1 pr-3 transition hover:border-brand-300"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">{user.name}</span>
              </Link>
              <span className="hidden md:block">
                <RoleBadge role={user.role} />
              </span>
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="grid h-9 w-9 place-items-center rounded-full text-muted transition hover:bg-brand-50 hover:text-brand-700"
              >
                <Icon name="logout" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-3.5 py-2 text-sm font-semibold transition hover:bg-brand-50">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-brand-200 bg-white px-3.5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Daftar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}