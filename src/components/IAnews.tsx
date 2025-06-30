import { useEffect, useState } from "react";
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
//import FroalaEditor from "react-froala-wysiwyg";
import { CategoriesAPI } from "../services/categories";
import { UploadImage } from "../services/uploadImages";
import { toast, ToastContainer } from "react-toastify";
import { PostAPI } from "../services/post";
import TiptapEditor from "./TipTapEditor";

export default function IAnews() {
  const [step, setStep] = useState<"prompt" | "edit">("prompt");
  const [prompt, setPrompt] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [chatPrompt, setChatPrompt] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  async function loadData() {
    try {
      const Datacategories = await CategoriesAPI.GetAll();
      setCategories(Datacategories);
    } catch {
      toast.error(
        "Não foi possível carregar as informações. Tente novamente mais tarde."
      );
    }
  }

  async function uploadImage(file: File) {
    const path = await UploadImage.upload(file);
    return path.url;
  }

  function clearInputs() {
    setEditorContent("");
    setImage(null);
    setChatPrompt("");
    setSelectedCategory(null);
    setTitle("");
    setSummary("");
  }

  //obs: add localidade nos posts
  //obs: melhorar editor de texto

  async function CreatePost() {
    let pathImage = "";

    if (!title) {
      toast.warn("Por favor, insira o título da notícia antes de continuar.");
      return;
    }
    if (!summary) {
      toast.warn(
        "Por favor, insira um resumo para a notícia antes de continuar."
      );
      return;
    }
    if (!image) {
      toast.warn("Por favor, selecione uma imagem para a notícia.");
      return;
    }
    if (!editorContent) {
      toast.warn("Por favor, insira o conteúdo da notícia antes de continuar.");
      return;
    }
    if (!selectedCategory) {
      toast.warn(
        "Por favor, escolha uma categoria para a notícia antes de continuar."
      );
      return;
    }

    try {
      pathImage = await uploadImage(image);
    } catch {
      toast.error(
        "Erro ao fazer upload da imagem. Por favor, tente novamente."
      );
      return;
    }

    const DataNotice = {
      title: title,
      summary: summary,
      content: editorContent,
      image: pathImage,
      published: status === "published" ? true : false,
    };

    try {
      await PostAPI.create(DataNotice, Number(selectedCategory));
      toast.success("Notícia criada com sucesso!");
      clearInputs();
    } catch {
      toast.error(
        "Não foi possível criar a notícia. Por favor, tente novamente mais tarde."
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handlePromptSubmit = async () => {
    setLoading(true);
    setEditorContent(`${prompt}`);
    setStep("edit");
    setLoading(false);
  };

  const handleChatPrompt = async () => {
    setEditorContent((prev) => prev + `\n\n${chatPrompt}`);
    setChatPrompt("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

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
        <span className="text-[#fff] font-semibold">Gerando notícia...</span>
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
    <div
      className="min-h-screen flex items-center justify-center px-2 py-6"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #e63946 0%, #1f1f1f 70%, #181a1b 100%)",
      }}
    >
      <div className="w-full max-w-6xl">
        {step === "prompt" && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md mx-auto flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[#18181b] mb-6 text-center">
              O que vamos criar hoje?
            </h2>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
              rows={4}
              placeholder="Descreva sua ideia de notícia..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="flex items-center gap-2 bg-[#e63946] text-white px-6 py-2 rounded-lg font-semibold transition 
                                                        hover:bg-[#d62839] hover:shadow-lg hover:scale-105 active:scale-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e63946]"
              onClick={handlePromptSubmit}
              disabled={!prompt.trim()}
              style={{
                opacity: !prompt.trim() ? 0.6 : 1,
                pointerEvents: !prompt.trim() ? "none" : "auto",
              }}
            >
              <Plus size={18} /> Criar
            </button>
            <button
              className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline bg-transparent px-2 py-1 rounded transition cursor-pointer"
              onClick={() => setStep("edit")}
              type="button"
            >
              Pular
            </button>
          </div>
        )}

        {step === "edit" && (
          <div
            className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full h-full max-w-6xl mx-auto flex flex-col gap-6 overflow-auto"
            style={{ minHeight: "90vh", maxHeight: "90vh" }}
          >
            {/* Mobile: stack, Desktop: row */}
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* Left: Image + Editor */}
              <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
                {/* Editor */}
                <div className="flex-1 flex flex-col min-h-0">
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <FileText size={18} /> Conteúdo da notícia
                  </label>
                  <div
                    className="flex-1 min-h-[200px] max-h-full overflow-auto rounded border border-gray-200"
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    <TiptapEditor
                      content={editorContent}
                      onChange={setEditorContent}
                      editorProps={{
                        attributes: {
                          style:
                            "word-break: break-word; overflow-wrap: break-word; max-width: 100%;",
                        },
                      }}
                    />
                  </div>
                </div>
                {/* Chat IA */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <MessageCircle size={18} /> Chat da IA
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                      placeholder="Envie um novo prompt..."
                      value={chatPrompt}
                      onChange={(e) => setChatPrompt(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && chatPrompt.trim()) {
                          handleChatPrompt();
                        }
                      }}
                      maxLength={300}
                    />
                    <button
                      className="bg-[#e63946] text-white rounded-lg p-2 hover:bg-[#d62839] transition"
                      onClick={handleChatPrompt}
                      disabled={!chatPrompt.trim()}
                      type="button"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Chat + Options */}
              <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0 h-full">
                {/* Título da notícia */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <FileText size={18} /> Título da notícia
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#e63946]"
                    placeholder="Digite o título da notícia..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={120}
                  />
                </div>
                {/* Resumo da notícia */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                    <FileText size={18} /> Resumo da notícia
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#e63946] resize-none"
                    rows={4}
                    placeholder="Digite um resumo breve da notícia..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    maxLength={300}
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
                    <span className="ml-2 text-xs text-[#e63946] truncate max-w-[120px]">
                      {image.name}
                    </span>
                  )}
                </label>
                {/* Categoria única */}
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
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === "published"}
                        onChange={() => setStatus("published")}
                      />
                      Publicar
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
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
                  onClick={() => CreatePost()}
                  type="button"
                >
                  <Save size={18} />{" "}
                  {status === "published" ? "Postar" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

{
  /* <div className="flex-1 flex flex-col min-h-0">
  <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
    <FileText size={18} /> Conteúdo da notícia
  </label>
  <div className="flex-1 min-h-[200px] max-h-full overflow-auto">
    <FroalaEditor
      tag="textarea"
      model={editorContent}
      onModelChange={setEditorContent}
      config={{
        height: 300,
        toolbarSticky: false,
        placeholderText: "Digite o conteúdo da notícia...",
        charCounterCount: true,
        imageUpload: false,
        quickInsertEnabled: false,
      }}
    />
  </div>
</div>; */
}
