import { useState } from "react";
import {
  FaRobot,
  FaRegNewspaper,
  FaTags,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router";

const menuItems = [
  { label: "Inteligência Artificial", icon: <FaRobot />, key: "ia" },
  { label: "Postagens", icon: <FaRegNewspaper />, key: "posts" },
  { label: "Categorias", icon: <FaTags />, key: "categories" },
  { label: "Configurações", icon: <FaCog />, key: "settings" },
];

// Componentes de exemplo para cada sessão
function IAComponent() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 min-h-[200px] flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Inteligência Artificial
      </h2>
      <p className="text-gray-500">Conteúdo de Inteligência Artificial</p>
    </div>
  );
}
function PostsComponent() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 min-h-[200px] flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Postagens</h2>
      <p className="text-gray-500">Conteúdo de Postagens</p>
    </div>
  );
}
function CategoriesComponent() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 min-h-[200px] flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Categorias</h2>
      <p className="text-gray-500">Conteúdo de Categorias</p>
    </div>
  );
}
function SettingsComponent() {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 min-h-[200px] flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        Configurações
      </h2>
      <p className="text-gray-500">Conteúdo de Configurações</p>
    </div>
  );
}

const components: Record<string, JSX.Element> = {
  ia: <IAComponent />,
  posts: <PostsComponent />,
  categories: <CategoriesComponent />,
  settings: <SettingsComponent />,
};

export default function Painel() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState("ia");
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white font-sans">
      {/* Sidebar */}
      <div>
        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity md:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 shadow-xl
                        ${
                          sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                        }
                        md:static md:translate-x-0
                    `}
        >
          <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
            <span className="text-2xl font-bold text-red-600 tracking-tight">
              Painel
            </span>
            <button
              className="md:hidden text-gray-400 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={22} />
            </button>
          </div>
          <nav className="flex-1 py-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`flex items-center w-full px-7 py-3 rounded-lg gap-3 font-medium transition-all
                                    ${
                                      selected === item.key
                                        ? "bg-red-600 text-white shadow"
                                        : "text-gray-700 hover:bg-red-50"
                                    }
                                `}
                onClick={() => {
                  setSelected(item.key);
                  setSidebarOpen(false);
                }}
              >
                <span
                  className={`text-lg ${
                    selected === item.key ? "text-white" : "text-red-600"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
          {/* Footer with logout */}
          <div className="px-7 py-6 border-t border-gray-100">
            <button
              className="flex items-center gap-3 text-red-600 font-medium hover:text-red-800 transition-colors"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
              Sair
            </button>
          </div>
        </aside>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center h-16 px-6 border-b border-gray-100 md:hidden bg-white shadow-sm">
          <button className="text-red-600" onClick={() => setSidebarOpen(true)}>
            <FaBars size={24} />
          </button>
          <span className="ml-4 text-2xl font-bold text-red-600 tracking-tight">
            Painel
          </span>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {components[selected]}
            {/* Exemplo de outro card, pode adicionar mais cards aqui */}
            {/* <div className="bg-white rounded-xl shadow-md p-8 min-h-[200px]"></div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
