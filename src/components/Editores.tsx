import { useEffect, useState } from "react";
import { AuthAPI } from "../services/auth";
import { toast, ToastContainer } from "react-toastify";

type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  password?: string;
};

export default function Editores() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });
  
  const [editUser, setEditUser] = useState({
    id: 0,
    name: "",
    role: "",
    email: "",
    password: "",
  });

  async function handleAddUser() {
    try {
      if (
        !newUser.name ||
        !newUser.role ||
        !newUser.email ||
        !newUser.password
      ) {
        toast.warn("Preencha todos os campos antes de continuar.");
        return;
      }
      setLoading(true);
      await AuthAPI.createUser(newUser);
      setShowModal(false);
      loadData();
      setLoading(false);
    } catch {
      toast.error(
        "Erro ao criar editor. Verifique os dados e tente novamente."
      );
    }
  }

  async function handleEditUser() {
    try {
      setLoading(true);
      await AuthAPI.updateUser(Number(editUser.id), editUser);
      setShowModalEdit(false);
      loadData();
      setLoading(false);
    } catch {
      toast.error(
        "Erro ao editar editor. Verifique os dados e tente novamente."
      );
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Tem certeza que deseja excluir este editor?")) return;
    setLoading(true);
    await AuthAPI.deleteUser(Number(id));
    toast.success("Editor excluído com sucesso!");
    loadData();
    setLoading(false);
  }

  async function loadData() {
    try {
      const allUsers = await AuthAPI.getAllUsers();
      setUsers(allUsers);
    } catch {
      toast.error(
        "Não foi possível carregar os editores. Tente novamente mais tarde."
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function LoadingSpinner() {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 py-8 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, #e63946 0%, #1f1f1f 70%, #181a1b 100%)",
        }}
      >
        <div className="w-10 h-10 border-4 border-[#fff] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[#fff] font-semibold">Carregando...</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/30">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Top Nav */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-[#181818] border-b border-gray-800 gap-2">
        <h1 className="text-2xl font-bold text-center w-full sm:w-auto">
          Editores
        </h1>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#e74c3c] hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition w-full sm:w-auto"
          >
            Novo Editor
          </button>
        </div>
      </nav>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-2"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div className="bg-[#232323] text-[#f5f5f5] rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Novo Editor</h2>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Nome"
              value={newUser.name}
              onChange={(e) =>
                setNewUser((u) => ({ ...u, name: e.target.value }))
              }
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Cargo"
              value={newUser.role}
              onChange={(e) =>
                setNewUser((u) => ({ ...u, role: e.target.value }))
              }
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="E-mail"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((u) => ({ ...u, email: e.target.value }))
              }
            />
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Senha"
              value={newUser.password}
              onChange={(e) =>
                setNewUser((u) => ({ ...u, password: e.target.value }))
              }
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 text-[#181818] hover:bg-gray-300 w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded bg-[#e74c3c] text-white font-semibold hover:bg-red-600 w-full sm:w-auto"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalEdit && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-2"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div className="bg-[#232323] text-[#f5f5f5] rounded-lg shadow-lg w-full max-w-md p-4 sm:p-6">
            <h2 className="text-xl font-bold mb-4">Editar Editor</h2>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Nome"
              value={editUser.name}
              onChange={(e) =>
                setEditUser((u) => ({ ...u, name: e.target.value }))
              }
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Cargo"
              value={editUser.role}
              onChange={(e) =>
                setEditUser((u) => ({ ...u, role: e.target.value }))
              }
            />
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="E-mail"
              value={editUser.email}
              onChange={(e) =>
                setEditUser((u) => ({ ...u, email: e.target.value }))
              }
            />
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Senha (deixe em branco para não alterar)"
              value={editUser.password}
              onChange={(e) =>
                setEditUser((u) => ({ ...u, password: e.target.value }))
              }
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setShowModalEdit(false)}
                className="px-4 py-2 rounded bg-gray-200 text-[#181818] hover:bg-gray-300 w-full sm:w-auto"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 rounded bg-[#e74c3c] text-white font-semibold hover:bg-red-600 w-full sm:w-auto"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-[#232323] text-[#f5f5f5] rounded-lg shadow p-4 sm:p-5 flex flex-col gap-2"
          >
            <h3 className="text-lg font-bold break-words">{user.name}</h3>
            <p className="text-sm text-gray-300 break-words">{user.role}</p>
            <p className="text-sm text-gray-400 break-words">{user.email}</p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-[#e74c3c] text-white hover:bg-red-600 text-sm w-full sm:w-auto"
                onClick={() => handleDelete(user.id)}
              >
                Excluir
              </button>
              <button
                className="px-3 py-1 rounded border border-[#e74c3c] text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white text-sm w-full sm:w-auto"
                onClick={() => {
                  setShowModalEdit(true);
                  setEditUser({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    email: user.email,
                    password: "",
                  });
                }}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="col-span-full text-center text-gray-400 mt-10">
            Nenhum editor cadastrado.
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
