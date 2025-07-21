import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../features/auth/LoginPage";
import RedirectByRole from "../components/RedirectByRole";
import Painel from "../features/user/Painel";
import PainelAdmin from "../features/admin/Painel";
import Home from "../features/news/Home";

export default function AppRoutes() {
  return (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<RedirectByRole />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/admin" element={<PainelAdmin />} />
    </Routes>
  </BrowserRouter>
  );
}
