import React, { useEffect, useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { CategoriesAPI } from "../services/categories";

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  async function loadData() {
    const category = await CategoriesAPI.GetAll();
    console.log(category);
    setCategories(category);
  }

  useEffect(()=>{
    loadData();
  },[])

  return (
    <nav className="bg-[#222] text-white py-2 px-4 relative z-10">
      {/* Menu Overlay (Mobile & Desktop) */}
      {menuOpen && (
        <div
          className="fixed inset-0 flex z-20 flex"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="bg-white text-[#222] w-64 h-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-2xl text-[#222] hover:text-[#e74c3c]"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <FaTimes />
            </button>
            <h3 className="mb-6 text-[#e74c3c] font-bold text-lg">
              Categorias
            </h3>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="cursor-pointer hover:text-[#e74c3c] transition"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Left: Hamburger */}
        <div className="flex-1 flex justify-start">
          <button
            className="bg-transparent border-none text-[#e74c3c] text-2xl cursor-pointer flex items-center"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <FaBars />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <span className="font-bold text-2xl tracking-wide text-[#e74c3c] select-none md:text-xl">
            <img
              src="/src/assets/LOGO NEURONA.png"
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover"
            />
          </span>
        </div>

        {/* Right: Search */}
        <div className="flex-1 flex justify-end">
          <form
            className="flex items-center bg-white rounded px-2 min-w-[120px] max-w-[220px] w-full md:max-w-[220px] md:min-w-[120px]"
            onSubmit={(e) => {
              e.preventDefault();
              // handle search
            }}
          >
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none outline-none bg-transparent text-[#222] text-base flex-1 py-1 px-1"
            />
            <button
              type="submit"
              className="bg-transparent border-none text-[#e74c3c] text-lg cursor-pointer p-0"
              aria-label="Buscar"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
