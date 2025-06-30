import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaShareAlt } from "react-icons/fa";
import { PostAPI } from "../services/post";
import { toast, ToastContainer } from "react-toastify";
import TiptapEditor from "./TipTapEditor";
import {
  Image,
  Send,
  Plus,
  FileText,
  MessageCircle,
  Tag,
  CheckCircle,
  Save,
} from "lucide-react";
import { CategoriesAPI } from "../services/categories";
import { UploadImage } from "../services/uploadImages";

export default function Posts() {
  const [posts, getPosts] = useState([]);
  const [step, setStep] = useState<"null" | "edit">("null");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [chatPrompt, setChatPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [objectpost, setObjectPost] = useState({
    id: "",
    title: "",
    slug: "",
    summary: "",
    content: "",
    image: "",
    published: false,
  });

  async function uploadImage(file: File) {
    const path = await UploadImage.upload(file);
    return path.url;
  }

  async function UpdatePost() {
    let pathImage = objectpost.image;

    if (image) {
      try {
        pathImage = await uploadImage(image);        
      } catch {
        toast.error("Erro ao fazer upload da imagem. Por favor, tente novamente.");
        return;
      }

    }

    const DataNotice = {
      title: title || objectpost.title,
      slug: objectpost.slug,
      summary: summary || objectpost.summary,
      content: editorContent || objectpost.content,
      image: pathImage,
      published: status === "published" ? true : false,
    };

    try {
      setLoading(true);
      await PostAPI.update(Number(objectpost.id), DataNotice);
      toast.success("Notícia atualizada com sucesso!");
      loadData();
      setStep("null");
      setLoading(false);
    } catch {
      toast.error("Ocorreu um erro ao atualizar a notícia. Tente novamente.");
    }
  }

  const handleChatPrompt = async () => {
    setEditorContent((prev) => prev + `\n\n${chatPrompt}`);
    setChatPrompt("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  async function removePost(idPost: number) {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      await PostAPI.delete(idPost);
      toast.success("Publicação excluída com sucesso!");
      loadData();
    } catch {
      toast.error("Não foi possível excluir a publicação.");
    }
  }

  async function loadData() {
    try {
      const allPosts = await PostAPI.getAllByUser();
      getPosts(allPosts);
      const Datacategories = await CategoriesAPI.GetAll();
      setCategories(Datacategories);
    } catch {
      toast.error(
        "Não foi possível carregar as informações. Tente novamente mais tarde."
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
              <div className="flex-1 flex flex-col">
                <span className="text-lg font-medium">{post.title}</span>
                {/* Indicador de status */}
                <span
                  className={`mt-1 text-xs font-semibold w-fit px-2 py-0.5 rounded ${
                    post.published
                      ? "bg-green-600 text-white"
                      : "bg-yellow-500 text-black"
                  }`}
                >
                  {post.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="p-2 rounded hover:bg-[#333] transition"
                  title="Visualizar"
                  onClick={() =>
                    window.open(
                      `${window.location.origin}/${post.slug}`,
                      "_blank"
                    )
                  }
                >
                  <FaEye className="text-white" />
                </button>
                <button
                  className="p-2 rounded hover:bg-[#333] transition"
                  title="Editar"
                  onClick={() => {
                    setObjectPost(post);
                    setTitle(post.title);
                    setSummary(post.summary);
                    setEditorContent(post.content);
                    setImage(null);
                    setSelectedCategory(post.categoryId || null);
                    setStatus(post.published ? "published" : "draft");
                    setStep("edit");
                  }}
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
                      navigator
                        .share({
                          title: post.title,
                          url: shareUrl,
                        })
                        .catch(() => {});
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

      {step === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div
            className="relative bg-white rounded-xl shadow-2xl p-4 sm:p-8 w-full max-w-5xl mx-auto flex flex-col gap-8 overflow-y-auto"
            style={{
              minHeight: "80vh",
              maxHeight: "95vh",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Botão de fechar */}
            <button
              className="absolute top-3 right-3 text-[#e63946] hover:text-[#c0392b] text-2xl font-bold z-10"
              onClick={() => setStep("null")}
              aria-label="Fechar"
              type="button"
            >
              ×
            </button>
            {/* Mobile: stack, Desktop: row */}
            <div className="flex flex-col lg:flex-row gap-8 h-full">
              {/* Left: Image + Editor */}
              <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
                {/* Título da notícia */}

                {/* Editor */}
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <FileText size={18} /> Conteúdo da notícia
                  </label>
                  <div
                    className="flex-1 min-h-[200px] max-h-full overflow-auto bg-white rounded-lg border border-gray-200"
                    style={{ color: "#18181b" }}
                  >
                    <TiptapEditor
                      content={editorContent}
                      onChange={setEditorContent}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Chat + Options */}
              <div className="w-full lg:w-96 flex flex-col gap-4 flex-shrink-0 h-full">
                {/* Categoria única */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <FileText size={18} /> Título da notícia
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#e63946] text-[#18181b] bg-white"
                    placeholder="Digite o título da notícia..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                {/* Resumo da notícia */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <FileText size={18} /> Resumo da notícia
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#e63946] resize-none text-[#18181b] bg-white"
                    rows={4}
                    placeholder="Digite um resumo breve da notícia..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>
                {/* Image input */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <Image className="text-[#18181b]" size={20} />
                  <span className="text-[#18181b] font-medium">
                    Imagem da notícia
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {image && (
                    <span className="ml-2 text-xs text-[#e63946]">
                      {image.name}
                    </span>
                  )}
                </label>
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <Tag size={18} /> Categoria
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat: any) => (
                      <button
                        key={cat.id}
                        className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                          selectedCategory === cat.id
                            ? "bg-[#e63946] text-white border-[#e63946]"
                            : "bg-white text-[#18181b] border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(cat.id)}
                        type="button"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <CheckCircle size={18} /> Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1 cursor-pointer text-[#18181b]">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === "published"}
                        onChange={() => setStatus("published")}
                      />
                      Publicar
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-[#18181b]">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === "draft"}
                        onChange={() => setStatus("draft")}
                      />
                      Rascunho
                    </label>
                  </div>
                </div>

                {/* Post Button */}
                <button
                  className="mt-4 flex items-center gap-2 bg-[#e63946] text-white px-6 py-2 rounded-lg font-semibold transition hover:bg-[#d62839] hover:shadow-lg hover:scale-105 active:scale-100 cursor-pointer"
                  onClick={() => UpdatePost()}
                >
                  <Save size={18} />{" "}
                  {status === "published" ? "Postar" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

// Tailwind custom color (alizarin):
// No tailwind.config.js, adicione:
// colors: { 'alizarin': { 500: '#e74c3c', 600: '#c0392b' } }
