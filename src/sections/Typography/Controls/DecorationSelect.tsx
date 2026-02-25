import { useBrandStore } from "../../../store/brandStore";
import { resolveVariant } from "../helpers";

export default function DecorationSelect({
  styleKey,
  variant
}: {
  styleKey: string;
  variant: "desktop" | "tablet" | "mobile";
}) {
  const { draft, updateDraft } = useBrandStore();

  const typography = draft.brand.typography;
  const style = typography.textStyles[styleKey];
  const resolved = resolveVariant(style, variant);

  return (
    <select
      value={resolved.decoration ?? ""}
      onChange={(e) =>
        updateDraft(
          [
            "brand",
            "typography",
            "textStyles",
            styleKey,
            "variants",
            variant,
            "decoration"
          ],
          e.target.value || undefined
        )
      }
      className="bg-black border border-gray-800 rounded px-3 py-2"
    >
      <option value="">Inherit</option>
      {typography.primitives.decorations.map((d: string) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  );
}