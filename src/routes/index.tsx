import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../features/auth/LoginPage";
import RedirectByRole from "../components/RedirectByRole";
import Painel from "../features/user/Painel";

export default function AppRoutes() {
  return (
  <BrowserRouter>
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<RedirectByRole />} />
        <Route path="/painel" element={<Painel />} />
    </Routes>
  </BrowserRouter>
  );
}
