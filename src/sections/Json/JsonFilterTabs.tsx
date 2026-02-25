import type { JsonModule } from "./jsonPaths";

type Props = {
  active: JsonModule;
  onChange: (m: JsonModule) => void;
};

export default function JsonFilterTabs({
  active,
  onChange
}: Props) {
  const tabs: { id: JsonModule; label: string }[] = [
    { id: "all", label: "All" },
    { id: "typography", label: "Typography" },
    { id: "colors", label: "Colors" },
    { id: "layout", label: "Layout" },
    { id: "identity", label: "Identity" }
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`px-3 py-1.5 rounded-md text-sm transition
              ${
                isActive
                  ? "bg-emerald-500 text-black"
                  : "bg-gray-900 text-gray-400 hover:text-gray-200"
              }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}