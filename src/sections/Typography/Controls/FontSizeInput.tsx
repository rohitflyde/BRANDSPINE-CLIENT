import { useBrandStore } from "../../../store/brandStore";

export default function FontSizeInput({ styleKey, variant }: any) {
  const { draft, updateDraft } = useBrandStore();
  const value =
    draft.brand.typography.textStyles[styleKey]
      .variants?.[variant]?.fontSize ?? 16;

  const path = [
    "brand","typography","textStyles",styleKey,"variants",variant,"fontSize"
  ];

  return (
    <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg px-3 h-10">
      <button onClick={() => updateDraft(path, value - 1)}>–</button>
      <input
        value={value}
        onChange={(e) => updateDraft(path, Number(e.target.value))}
        className="w-10 bg-transparent text-center text-sm outline-none"
      />
      <button onClick={() => updateDraft(path, value + 1)}>+</button>
    </div>
  );
}