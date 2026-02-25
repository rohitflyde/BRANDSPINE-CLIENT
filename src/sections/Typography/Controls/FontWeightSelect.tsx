// src/sections/Typography/Controls/FontWeightSelect.tsx
import { useBrandStore } from "../../../store/brandStore";
import { resolveVariant } from "../helpers";

type Props = {
  styleKey: string;
  variant: "desktop" | "mobile";
};

export default function FontWeightSelect({
  styleKey,
  variant
}: Props) {
  const { draft, updateDraft } = useBrandStore();

  const typography = draft.brand.typography;
  const style = typography.textStyles[styleKey];
  if (!style) return null;

  // Resolve variant correctly
  const resolved = resolveVariant(style, variant);
  const currentWeight = resolved.fontWeight;

  const font =
    typography.primitives.fontFamilies[
      resolved.fontFamily
    ];

  /* ==========================
     Compute available weights
  ========================== */
  const availableWeights: number[] = font?.sources
    ? Array.from(
        new Set<number>(
          font.sources.map(
            (s: { weight: number }) => s.weight
          )
        )
      ).sort((a: number, b: number) => a - b)
    : typography.primitives.fontWeights;

  return (
    <select
      value={currentWeight}
      onChange={(e) =>
        updateDraft(
          [
            "brand",
            "typography",
            "textStyles",
            styleKey,
            "variants",
            variant,
            "fontWeight"
          ],
          Number(e.target.value)
        )
      }
      className="bg-black border border-gray-800 rounded-lg px-3 h-10 text-white"
    >
      {availableWeights.map((w: number) => (
        <option key={w} value={w}>
          {w}
        </option>
      ))}
    </select>
  );
}