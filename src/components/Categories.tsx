import { useEffect, useState } from "react";
import { CategoriesAPI } from "../services/categories";
import { toast, ToastContainer } from "react-toastify";

type Category = {
  id: number;
  name: string;
  description: string;
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editCategory, setEditCategory] = useState({
    id: 0,
    name: "",
    description: "",
  });

  async function handleAddCategory() {
    try {
      if (!newCategory.name) {
        toast.warn("Por favor, insira o nome da categoria antes de continuar.");
        return;
      }
      if (!newCategory.description) {
        toast.warn(
          "Por favor, insira a descrição da categoria antes de continuar."
        );
        return;
      }
      setLoading(true);
      await CategoriesAPI.Create(newCategory);
      setShowModal(false);
      loadData();
      setLoading(false);
    } catch {
      toast.error(
        "Erro ao criar categoria. Verifique os dados e tente novamente."
      );
    }
  }

  async function handleEditCategory() {
    try {
      setLoading(true);
      await CategoriesAPI.EditCategory(Number(editCategory.id), editCategory);
      setShowModalEdit(false);
      loadData();
      setLoading(false);
    } catch {
      toast.error(
        "Erro ao editar categoria. Verifique os dados e tente novamente."
      );
    }
  }

  async function handleDelete(id: number) {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }
    setLoading(true);
    await CategoriesAPI.Remove(id);
    toast.success("Publicação excluída com sucesso!");
    loadData();
    setLoading(false);
  }

  async function loadData() {
    try {
      const allCategories = await CategoriesAPI.GetAll();
      setCategories(allCategories);
    } catch {
      toast.error(
        "Não foi possível carregar as categorias. Tente novamente mais tarde."
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

  // Alizarin: #e74c3c, Dark: #181818
  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Top Nav */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 bg-[#181818] border-b border-gray-800 gap-2">
        <h1 className="text-2xl font-bold text-center w-full sm:w-auto">
          Categorias
        </h1>
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#e74c3c] hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition w-full sm:w-auto"
          >
            Nova Categoria
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
            <h2 className="text-xl font-bold mb-4">Nova Categoria</h2>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Nome"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory((c) => ({ ...c, name: e.target.value }))
              }
            />
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Descrição"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory((c) => ({ ...c, description: e.target.value }))
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
                onClick={handleAddCategory}
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
            <h2 className="text-xl font-bold mb-4">Nova Categoria</h2>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Nome"
              value={editCategory.name}
              onChange={(e) =>
                setEditCategory((c) => ({ ...c, name: e.target.value }))
              }
            />
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-[#e74c3c] bg-[#181818] text-white"
              placeholder="Descrição"
              value={editCategory.description}
              onChange={(e) =>
                setEditCategory((c) => ({ ...c, description: e.target.value }))
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
                onClick={handleEditCategory}
                className="px-4 py-2 rounded bg-[#e74c3c] text-white font-semibold hover:bg-red-600 w-full sm:w-auto"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[#232323] text-[#f5f5f5] rounded-lg shadow p-4 sm:p-5 flex flex-col gap-2"
          >
            <h3 className="text-lg font-bold break-words">{cat.name}</h3>
            <p className="text-sm text-gray-300 break-words">
              {cat.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                className="px-3 py-1 rounded bg-[#e74c3c] text-white hover:bg-red-600 text-sm w-full sm:w-auto"
                onClick={() => handleDelete(cat.id)}
              >
                Excluir
              </button>
              <button
                className="px-3 py-1 rounded border border-[#e74c3c] text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white text-sm w-full sm:w-auto"
                onClick={() => {
                  setShowModalEdit(true);
                  setEditCategory({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description,
                  });
                }}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center text-gray-400 mt-10">
            Nenhuma categoria cadastrada.
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
