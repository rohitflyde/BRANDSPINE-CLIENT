// src/sections/Typography/Preview.tsx
import { useEffect } from "react";
import { useBrandStore } from "../../store/brandStore";
import { resolveVariant } from "./helpers";
import { loadBrandFonts } from "../../utils/loadBrandFonts";

type Props = {
  styleKey: string;
  variant: "desktop" | "mobile";
  text: string;
};

export default function Preview({
  styleKey,
  variant,
  text
}: Props) {
  const { draft } = useBrandStore();

  if (!draft?.brand) return null;

  const typography = draft.brand.typography;
  const style =
    typography.textStyles?.[styleKey];

  if (!style) return null;

  /* ==========================
     Ensure brand fonts loaded
  ========================== */
  useEffect(() => {
    loadBrandFonts(
      typography.primitives.fontFamilies
    );
  }, [typography]);

  /* ==========================
     Resolve variant correctly
  ========================== */
  const v = resolveVariant(style, variant);

  const font =
    typography.primitives.fontFamilies[
      v.fontFamily
    ];

  if (!font) return null;

  return (
    <div className="bg-black border border-gray-800 rounded-xl p-6">
      <div
        className="text-white"
        style={{
          fontFamily: `"${font.family}", ${font.fallback.join(",")}`,
          fontSize: v.fontSize,
          fontWeight: v.fontWeight,
          lineHeight: v.lineHeight
            ? `${v.lineHeight}px`
            : undefined,
          textAlign: v.alignment ?? "left",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}
      >
        {text}
      </div>
    </div>
  );
}