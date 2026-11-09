import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../context/toast";
import { canCreateStall } from "../../utils/permissions";

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
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-blue-700">Review Kantin</Link>

        <nav className="flex items-center gap-4 text-sm">
          {canCreateStall(user) && (
            <Link to="/stalls/new" className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700">
              + Tambah Warung
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="hover:underline">{user.name}</Link>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs uppercase text-gray-600">{user.role}</span>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}