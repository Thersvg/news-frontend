import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AuthAPI } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await AuthAPI.auth(email, password);
      Cookies.set("token-news-access", data.accessToken);
      login(data.userData);
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Acesso não autorizado.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">
          Painel News
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Gerencie suas notícias.
        </p>
        <form className="w-full space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-xs font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              className="block text-xs font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold shadow hover:bg-red-600 transition cursor-pointer"
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </div>
    <ToastContainer />
    </div>
  );
}
