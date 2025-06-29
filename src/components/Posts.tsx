import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaShareAlt } from "react-icons/fa";
import { PostAPI } from "../services/post";
import { toast, ToastContainer } from "react-toastify";

export default function Posts() {
  const [posts, getPosts] = useState([]);

  async function removePost(idPost: number) {
    try {
      await PostAPI.delete(idPost);
      toast.success("Publicação excluída com sucesso!");
      loadData();
    } catch {
      toast.error("Não foi possível excluir a publicação.");
    }
  }

  async function loadData() {
    const allPosts = await PostAPI.getAllByUser();
    getPosts(allPosts);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col">
      {/* Top Nav */}
      <nav className="w-full px-4 py-4 flex items-center justify-between border-b border-[#222]">
        <span className="text-xl font-bold">Gerenciar Publicações</span>
        {/* Futuramente: botões adicionais aqui */}
      </nav>

      {/* Lista de Posts */}
      <div className="flex-1 w-full max-w-2xl mx-auto py-6 px-2">
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center bg-[#222] rounded-lg shadow p-3 gap-4 flex-col sm:flex-row"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-14 h-14 rounded object-cover"
              />
              <span className="flex-1 text-lg font-medium">{post.title}</span>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="p-2 rounded hover:bg-[#333] transition"
                  title="Visualizar"
                  onClick={() => window.open(`${window.location.origin}/${post.slug}`, "_blank")}
                >
                  <FaEye className="text-white" />
                </button>
                <button
                  className="p-2 rounded hover:bg-[#333] transition"
                  title="Editar"
                >
                  <FaEdit className="text-white" />
                </button>
                <button
                  className="p-2 rounded hover:bg-[#333] transition"
                  title="Excluir"
                  onClick={() => removePost(post.id)}
                >
                  <FaTrash className="text-alizarin-500" />
                </button>
                <button
                  className="p-2 rounded hover:bg-[#333] transition"
                  title="Compartilhar"
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/${post.slug}`;
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        url: shareUrl,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(shareUrl);
                      toast.info("Link copiado para a área de transferência!");
                    }
                  }}
                >
                  <FaShareAlt className="text-white" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ToastContainer />
    </div>
  );
}

// Tailwind custom color (alizarin):
// No tailwind.config.js, adicione:
// colors: { 'alizarin': { 500: '#e74c3c', 600: '#c0392b' } }
