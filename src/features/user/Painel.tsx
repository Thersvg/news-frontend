import { useState } from "react";
import { Menu, LogOut, Settings, Newspaper, Tags, Bot } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router";
import IAnews from "../../components/IAnews";
import Posts from "../../components/Posts";
import Categories from "../../components/Categories";

const menuItems = [
  { label: "NeuroIA", icon: <Bot size={20} />, key: "ia" },
  { label: "Postagens", icon: <Newspaper size={20} />, key: "posts" },
  { label: "Categorias", icon: <Tags size={20} />, key: "categories" },
  //{ label: "Configurações", icon: <Settings size={20} />, key: "settings" },
];

const components: Record<string, JSX.Element> = {
  ia: <IAnews />,
  posts: <Posts />,
  categories: <Categories />,
  //settings: <SettingsComponent />,
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
        <div
          className={`fixed inset-0 z-30 transition-opacity md:hidden ${
            sidebarOpen ? "block" : "hidden"
          }`}
          style={{
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#181818] flex flex-col transition-transform duration-200 shadow-2xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:static md:translate-x-0
        `}
        >
          {/* Avatar e nome */}
          <div className="flex flex-col items-center gap-2 px-7 py-8 border-b border-[#232425]">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#181a1b] text-2xl font-bold shadow-lg">
              {/* Avatar fictício */}
              <span>N</span>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              Neurona
            </span>
          </div>
          {/* Navegação */}
          <nav className="flex-1 py-6 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`flex items-center w-full px-7 py-3 rounded-lg gap-3 font-medium transition-all cursor-pointer
          ${
            selected === item.key
              ? "bg-[#e74c3c] text-white shadow"
              : "text-white hover:bg-[#232425] hover:text-[#e74c3c]"
          }
          `}
                onClick={() => {
                  setSelected(item.key);
                  setSidebarOpen(false);
                }}
              >
                <span
                  className={`text-lg ${
                    selected === item.key ? "text-white" : "text-[#e74c3c]"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
          {/* Footer com logout */}
          <div className="px-7 py-6 border-t border-[#232425] mt-auto">
            <button
              className="flex items-center gap-3 text-[#e74c3c] font-medium hover:text-white transition-colors cursor-pointer"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </aside>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top bar */}
        <header className="flex items-center h-16 px-6 border-b border-[#232425] md:hidden bg-[#181a1b] shadow-sm">
          <button
            className="text-[#e74c3c]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="ml-4 text-2xl font-bold text-white tracking-tight">
            Painel
          </span>
        </header>
        <main className="flex-1 overflow-auto flex items-stretch bg-white">
          <div className="flex-1 flex items-stretch">
            <div className="w-full flex items-stretch">
              <div className="flex-1 flex flex-col justify-center">
                {components[selected]}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
