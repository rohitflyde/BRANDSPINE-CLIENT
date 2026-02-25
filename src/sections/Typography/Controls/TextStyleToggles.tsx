import { useBrandStore } from "../../../store/brandStore";
import { resolveVariant } from "../helpers";

const OPTIONS = {
  alignment: ["left", "center", "right", "justify"],
  case: ["none", "uppercase", "lowercase", "capitalize"]
};

export default function TextStyleToggles({
  styleKey,
  variant,
  mode
}: {
  styleKey: string;
  variant: "desktop" | "tablet" | "mobile";
  mode: "alignment" | "case";
}) {
  const { draft, updateDraft } = useBrandStore();
  const style = draft.brand.typography.textStyles[styleKey];
  const resolved = resolveVariant(style, variant);

  const basePath = [
    "brand",
    "typography",
    "textStyles",
    styleKey,
    "variants",
    variant,
    mode
  ];

  return (
    <div className="flex gap-2">
      {OPTIONS[mode].map((val) => {
        const isActive = resolved[mode] === val;

        return (
          <button
            key={val}
            onClick={() =>
              updateDraft(
                basePath,
                val === resolved[mode] ? undefined : val
              )
            }
            className={`h-9 px-3 rounded-md border text-sm
              ${
                isActive
                  ? "border-emerald-500 text-emerald-400"
                  : "border-gray-800 text-gray-400"
              }`}
          >
            {val}
          </button>
        );
      })}
    </div>
  );
}