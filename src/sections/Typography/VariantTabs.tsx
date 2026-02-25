// src/sections/Typography/VariantTabs.tsx
const VARIANTS = ["desktop", "tablet", "mobile"] as const;

export default function VariantTabs({
  value,
  onChange
}: {
  value: "desktop" | "tablet" | "mobile";
  onChange: (v: any) => void;
}) {
  return (
    <div className="flex gap-2">
      {VARIANTS.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3 py-1.5 rounded-md text-sm
            ${
              value === v
                ? "bg-emerald-500 text-black"
                : "bg-gray-800 text-gray-400"
            }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}