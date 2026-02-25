// src/components/Sidebar.tsx
import { SECTIONS, type SectionId } from "../config/sections";
import { useBrandStore } from "../store/brandStore";
import { generateBrandCss } from "../utils/generateBrandCss";

interface SidebarProps {
  active: SectionId;
  onChange: (id: SectionId) => void;
}

export default function Sidebar({
  active,
  onChange
}: SidebarProps) {
  const { draft } = useBrandStore();

  function downloadCss() {
    if (!draft?.brand) return;

    const css = generateBrandCss(draft.brand);
    const blob = new Blob([css], {
      type: "text/css"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brand.css";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <aside className="w-64 bg-[#111] text-gray-300 flex flex-col">
      {/* Top brand */}
      <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-800">
        <img
          className="w-40"
          src="https://ik.imagekit.io/p1zreiw3z/Brandspine/BRANDSPINE.png"
          alt=""
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;

          return (
            <button
              key={section.id}
              onClick={() => onChange(section.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition
                ${
                  isActive
                    ? "bg-[#1c1c1c] text-emerald-400 border-l-4 border-emerald-400"
                    : "hover:bg-[#1a1a1a]"
                }
              `}
            >
              <span className="opacity-80">⬤</span>
              <span>{section.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Download CSS */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={downloadCss}
          className="w-full flex items-center justify-center gap-2 bg-emerald-400 text-black font-medium py-3 rounded-full hover:bg-emerald-300 transition"
        >
          Download CSS
        </button>
      </div>
    </aside>
  );
}