import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RoleRoute from "./components/guards/RoleRoute";
import StallListPage from "./pages/StallListPage";
import StallDetailPage from "./pages/StallDetailPage";
import StallCreatePage from "./pages/StallCreatePage.tsx";
import StallEditPage from "./pages/StallEditPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Publik */}
        <Route path="/" element={<StallListPage />} />
        <Route path="/stalls/:id" element={<StallDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Wajib login (semua role) */}
        <Route element={<RoleRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Hanya owner & admin */}
        <Route element={<RoleRoute roles={["owner", "admin"]} />}>
          <Route path="/stalls/new" element={<StallCreatePage />} />
          <Route path="/stalls/:id/edit" element={<StallEditPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}