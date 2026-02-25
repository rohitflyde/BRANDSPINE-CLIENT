import { useBrandStore } from "../../../store/brandStore";
import { resolveVariant } from "../helpers";

export default function LetterSpacingInput({
  styleKey,
  variant
}: {
  styleKey: string;
  variant: "desktop" | "tablet" | "mobile";
}) {
  const { draft, updateDraft } = useBrandStore();
  const style = draft.brand.typography.textStyles[styleKey];
  const resolved = resolveVariant(style, variant);

  return (
    <input
      type="number"
      value={resolved.letterSpacing ?? ""}
      placeholder="Letter spacing"
      onChange={(e) =>
        updateDraft(
          [
            "brand",
            "typography",
            "textStyles",
            styleKey,
            "variants",
            variant,
            "letterSpacing"
          ],
          e.target.value
            ? Number(e.target.value)
            : undefined
        )
      }
      className="bg-black border border-gray-800 rounded px-3 py-2 w-24"
    />
  );
}