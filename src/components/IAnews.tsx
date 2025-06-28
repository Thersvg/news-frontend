import { useState } from "react";
import { Image, Send, Plus, FileText, MessageCircle, Tag, CheckCircle, Save } from "lucide-react";
import FroalaEditor from 'react-froala-wysiwyg'

const categories = [
    "Política",
    "Esportes",
    "Tecnologia",
    "Entretenimento",
    "Economia",
];

export default function IAnews() {
    const [step, setStep] = useState<"prompt" | "edit">("prompt");
    const [prompt, setPrompt] = useState("");
    const [editorContent, setEditorContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [chatPrompt, setChatPrompt] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [status, setStatus] = useState<"draft" | "published">("draft");
    const [loading, setLoading] = useState(false);


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

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    function LoadingSpinner() {
        return (
            <div
                className="flex flex-col items-center justify-center gap-2 py-8 w-full h-full"
                style={{
                    background: "radial-gradient(circle at 50% 0%, #e63946 0%, #1f1f1f 70%, #181a1b 100%)",
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
            className="min-h-screen flex items-center justify-center"
            style={{
            background: "radial-gradient(circle at 50% 0%, #e63946 0%, #1f1f1f 70%, #181a1b 100%)",
            }}
        >
            {step === "prompt" && (
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
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
                </div>
            )}

            {step === "edit" && (
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-5xl flex gap-8">
                    {/* Left: Image + Editor */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Image input */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Image className="text-[#18181b]" size={20} />
                            <span className="text-[#18181b] font-medium">Imagem da notícia</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {image && (
                                <span className="ml-2 text-xs text-[#e63946]">{image.name}</span>
                            )}
                        </label>
                        {/* Editor */}
                        <div className="flex-1 flex flex-col">
                            <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                                <FileText size={18} /> Conteúdo da notícia
                            </label>
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
                    </div>

                    {/* Right: Chat + Options */}
                    <div className="w-80 flex flex-col gap-6">
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
                                />
                                <button
                                    className="bg-[#e63946] text-white rounded-lg p-2 hover:bg-[#d62839] transition"
                                    onClick={handleChatPrompt}
                                    disabled={!chatPrompt.trim()}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Categorias */}
                        <div>
                            <label className="flex items-center gap-2 mb-2 text-[#18181b] font-medium">
                                <Tag size={18} /> Categorias
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                                            selectedCategories.includes(cat)
                                                ? "bg-[#e63946] text-white border-[#e63946]"
                                                : "bg-white text-[#18181b] border-gray-300 hover:bg-gray-100"
                                        }`}
                                        onClick={() => toggleCategory(cat)}
                                        type="button"
                                    >
                                        {cat}
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
                            className="mt-4 flex items-center gap-2 bg-[#e63946] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d62839] transition"
                            // TODO: Implement submit logic
                        >
                            <Save size={18} /> {status === "published" ? "Postar" : "Salvar"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}