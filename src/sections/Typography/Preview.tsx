// src/sections/Typography/Preview.tsx
import { useEffect, useState } from "react";
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
  const [previewKey, setPreviewKey] = useState(0);

  if (!draft?.brand) return null;

  const typography = draft.brand.typography;
  const style = typography.textStyles?.[styleKey];

  if (!style) return null;

  // Force re-render when style changes
  useEffect(() => {
    setPreviewKey(prev => prev + 1);
  }, [style, variant]);

  /* ==========================
     Ensure brand fonts loaded
  ========================== */
  useEffect(() => {
    loadBrandFonts(typography.primitives.fontFamilies);
  }, [typography]);

  /* ==========================
     Resolve variant correctly
  ========================== */
  const v = resolveVariant(style, variant);

  const font = typography.primitives.fontFamilies[v.fontFamily];

  if (!font) return null;

  // Apply text transformations
  const getTransformedText = () => {
    let transformedText = text;

    // Apply text transform (uppercase, lowercase, capitalize)
    switch (v.case) {
      case 'uppercase':
        transformedText = transformedText.toUpperCase();
        break;
      case 'lowercase':
        transformedText = transformedText.toLowerCase();
        break;
      case 'capitalize':
        transformedText = transformedText.replace(/\b\w/g, l => l.toUpperCase());
        break;
      default:
        break;
    }

    return transformedText;
  };

  // Get text decoration style
  const getTextDecoration = () => {
    const decorations = [];
    if (v.decoration === 'underline') decorations.push('underline');
    if (v.decoration === 'line-through') decorations.push('line-through');
    return decorations.join(' ');
  };

  return (
    <div key={previewKey} className="bg-black border border-gray-800 rounded-xl p-6">
      <div
        className="text-white transition-all duration-150"
        style={{
          fontFamily: `"${font.family}", ${font.fallback.join(",")}`,
          fontSize: v.fontSize,
          fontWeight: v.fontWeight,
          lineHeight: v.lineHeight ? `${v.lineHeight}px` : undefined,
          textAlign: v.alignment ?? "left",
          textTransform: v.case === 'none' ? 'none' : v.case,
          textDecoration: getTextDecoration(),
          fontStyle: v.italic ? 'italic' : 'normal',
          letterSpacing: v.letterSpacing ? `${v.letterSpacing}px` : undefined,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        }}
      >
        {getTransformedText()}
      </div>
    </div>
  );
}