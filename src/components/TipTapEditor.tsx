import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!editor) return null;

  // Função para adicionar link
  const addLink = () => {
    const url = window.prompt("Digite a URL");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  // Função para adicionar imagem
  const addImage = () => {
    const url = window.prompt("Digite a URL da imagem");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-2 flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Negrito"
          title="Negrito (Ctrl+B)"
        >
          <b>B</b>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Itálico"
          title="Itálico (Ctrl+I)"
        >
          <i>I</i>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("underline")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Sublinhado"
          title="Sublinhado (Ctrl+U)"
        >
          <u>U</u>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("strike")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Tachado"
          title="Tachado"
        >
          <s>S</s>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("code")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Código"
          title="Código"
        >
          {"</>"}
        </button>

        {/* Cabeçalhos */}
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            className={`px-2 py-1 rounded ${
              editor.isActive("heading", { level })
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
            type="button"
            aria-label={`Cabeçalho nível ${level}`}
            title={`Cabeçalho nível ${level}`}
          >
            H{level}
          </button>
        ))}

        {/* Listas */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Lista com marcadores"
          title="Lista com marcadores"
        >
          • List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Lista numerada"
          title="Lista numerada"
        >
          1. List
        </button>

        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 rounded hover:bg-gray-200"
          type="button"
          aria-label="Linha horizontal"
          title="Linha horizontal"
        >
          ―――
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-2 py-1 rounded hover:bg-gray-200"
          type="button"
          aria-label="Desfazer"
          title="Desfazer (Ctrl+Z)"
        >
          ↺
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-2 py-1 rounded hover:bg-gray-200"
          type="button"
          aria-label="Refazer"
          title="Refazer (Ctrl+Y)"
        >
          ↻
        </button>

        {/* Link */}
        <button
          onClick={addLink}
          className={`px-2 py-1 rounded ${
            editor.isActive("link")
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-200"
          }`}
          type="button"
          aria-label="Inserir link"
          title="Inserir link"
        >
          🔗
        </button>

        {/* Imagem */}
        <button
          onClick={addImage}
          className="px-2 py-1 rounded hover:bg-gray-200"
          type="button"
          aria-label="Inserir imagem"
          title="Inserir imagem"
        >
          🖼️
        </button>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 rounded-md min-h-[300px] p-3 bg-white prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
