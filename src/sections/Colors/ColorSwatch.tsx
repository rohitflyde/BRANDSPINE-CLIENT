// src/sections/Colors/ColorSwatch.tsx
import { Edit2, Trash2 } from 'lucide-react';

type Props = {
  label: string;
  token: string;
  hex: string;
  semanticKey: string;
  mode: "light" | "dark";
  onEdit: () => void;
  onDelete?: () => void;
};

export default function ColorSwatch({
  label,
  token,
  hex,
  onEdit,
  onDelete
}: Props) {
  return (
    <div className="group relative">
      <button
        onClick={onEdit}
        className="block w-24 text-left focus:outline-none"
      >
        <div
          className="w-full h-20 rounded-lg mb-2 ring-2 ring-offset-2 ring-offset-gray-900 ring-gray-700 group-hover:ring-emerald-500 transition-all"
          style={{ backgroundColor: hex }}
        />
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-gray-400 font-mono mt-0.5">
          {token}
        </div>
        <div className="text-xs text-gray-500 font-mono">
          {hex}
        </div>
      </button>

      {/* Delete button - only show for custom colors (not primary, background, etc) */}
      {onDelete && !['primary', 'background', 'surface', 'textPrimary', 'textSecondary'].includes(token) && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this color?')) {
              onDelete();
            }
          }}
          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          title="Delete color"
        >
          <Trash2 size={12} className="text-white" />
        </button>
      )}
    </div>
  );
}