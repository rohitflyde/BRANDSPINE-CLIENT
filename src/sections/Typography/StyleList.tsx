// src/sections/Typography/StyleList.tsx
import { Plus, Edit2 } from 'lucide-react';

interface StyleListProps {
  styles: Record<string, any>;
  active: string;
  onSelect: (key: string) => void;
  onAddNew: () => void;
  onEditStyle: (key: string) => void;
}

export default function StyleList({
  styles,
  active,
  onSelect,
  onAddNew,
  onEditStyle
}: StyleListProps) {
  return (
    <aside className="w-64 border-r border-gray-800 flex flex-col h-full">
      {/* Styles List Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-400">Typography Styles</h3>
      </div>

      {/* Styles List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {Object.entries(styles).map(([key, style]) => {
          const isActive = key === active;

          return (
            <div
              key={key}
              className={`group flex items-center rounded-md transition-colors ${
                isActive ? 'bg-emerald-500/10' : 'hover:bg-gray-800'
              }`}
            >
              <button
                onClick={() => onSelect(key)}
                className={`
                  flex-1 text-left px-3 py-2 rounded-l-md text-sm
                  transition-colors duration-150
                  ${isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{style.label || key}</span>
                  {isActive && (
                    <span className="text-xs opacity-50">active</span>
                  )}
                </div>
              </button>
              
              {/* Edit Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditStyle(key);
                }}
                className={`
                  p-2 rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity
                  ${isActive 
                    ? 'text-emerald-400 hover:bg-emerald-500/20' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }
                `}
                title="Edit style name"
              >
                <Edit2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add New Button */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddNew();
          }}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors border border-gray-700"
        >
          <Plus size={18} />
          <span>Add New Style</span>
        </button>
      </div>
    </aside>
  );
}