// src/sections/Typography/StyleList.tsx
export default function StyleList({
  styles,
  active,
  onSelect
}: {
  styles: Record<string, any>;
  active: string;
  onSelect: (key: string) => void;
}) {
  return (
    <aside className="w-64 border-r border-gray-800 p-4 space-y-1">
      {Object.entries(styles).map(([key, style]) => {
        const isActive = key === active;

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`
              w-full text-left px-3 py-2 rounded-md text-sm
              transition
              ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }
            `}
          >
            {style.label}
          </button>
        );
      })}
    </aside>
  );
}