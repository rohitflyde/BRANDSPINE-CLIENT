// src/sections/Preview/WebPreview.tsx
import { useEffect, useState } from "react";
import { useBrandStore } from "../../store/brandStore";

import TypographyPreviewBlock from "./blocks/TypographyPreviewBlock";
import ColorPreviewBlock from "./blocks/ColorPreviewBlock";
import ButtonPreviewBlock from "./blocks/ButtonPreviewBlock";
import LogoPreviewBlock from "./blocks/LogoPreviewBlock";
import FaviconPreviewBlock from "./blocks/FaviconPreviewBlock";
import SpacingPreviewBlock from "./blocks/SpacingPreviewBlock";
import MobileFrame from "./MobileFrame";

import { loadBrandFonts } from "../../utils/loadBrandFonts";

type Variant = "desktop" | "mobile";

export default function WebPreview() {
  const { draft } = useBrandStore();
  const [variant, setVariant] =
    useState<Variant>("desktop");

  if (!draft?.brand) return null;

  /* ==========================
     Load brand fonts ONCE
  ========================== */
  useEffect(() => {
    loadBrandFonts(
      draft.brand.typography.primitives.fontFamilies
    );
  }, [draft]);

  const semantic =
    draft.brand.colors.modes.light.semantic as Record<
      string,
      string
    >;

  const palette =
    draft.brand.colors.primitives.palette as Record<
      string,
      string
    >;

  /* ==========================
     Preview-only button theming
  ========================== */
  const [buttonBgToken, setButtonBgToken] =
    useState<string>(semantic.primary);

  const [buttonTextToken, setButtonTextToken] =
    useState<string>(semantic.textPrimary);

  const buttonBg = palette[buttonBgToken];
  const buttonText = palette[buttonTextToken];

  const content = (
    <div className="space-y-16">
      <TypographyPreviewBlock variant={variant} />
      <ColorPreviewBlock />
      <ButtonPreviewBlock
        variant={variant}
        background={buttonBg}
        textColor={buttonText}
      />
      <LogoPreviewBlock />
      <FaviconPreviewBlock />
      <SpacingPreviewBlock variant={variant} />
    </div>
  );

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale"
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex flex-wrap gap-4 items-center justify-between px-10 py-4 border-b border-gray-800 bg-black">
        <h1 className="text-lg font-semibold">
          Web Preview
        </h1>

        <div className="flex items-center gap-4">
          {/* Variant switch */}
          <div className="flex gap-2 bg-gray-900 rounded-full p-1">
            {(["desktop", "mobile"] as const).map(
              (bp) => (
                <button
                  key={bp}
                  onClick={() => setVariant(bp)}
                  className={`px-4 py-1.5 rounded-full text-sm transition
                    ${
                      variant === bp
                        ? "bg-emerald-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                >
                  {bp}
                </button>
              )
            )}
          </div>

          {/* Button background */}
          <select
            value={buttonBgToken}
            onChange={(e) =>
              setButtonBgToken(e.target.value)
            }
            className="bg-gray-900 text-white text-sm rounded px-2 py-1"
          >
            {Object.entries(semantic).map(
              ([key, token]) => (
                <option key={key} value={token}>
                  Button BG · {key}
                </option>
              )
            )}
          </select>

          {/* Button text */}
          <select
            value={buttonTextToken}
            onChange={(e) =>
              setButtonTextToken(e.target.value)
            }
            className="bg-gray-900 text-white text-sm rounded px-2 py-1"
          >
            {Object.entries(semantic).map(
              ([key, token]) => (
                <option key={key} value={token}>
                  Button Text · {key}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Preview body */}
      {variant === "mobile" ? (
        <MobileFrame>{content}</MobileFrame>
      ) : (
        <div className="p-10">{content}</div>
      )}
    </div>
  );
}