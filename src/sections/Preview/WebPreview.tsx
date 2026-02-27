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
  const [variant, setVariant] = useState<Variant>("desktop");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

  if (!draft?.brand) return null;

  /* ==========================
     Load brand fonts ONCE
  ========================== */
  useEffect(() => {
    if (draft?.brand?.typography?.primitives?.fontFamilies) {
      loadBrandFonts(draft.brand.typography.primitives.fontFamilies);
    }
  }, [draft]);

  // Safely get color modes with fallbacks
  const colorModes = draft.brand.colors?.modes || {};
  const hasLightMode = !!colorModes.light?.semantic;
  const hasDarkMode = !!colorModes.dark?.semantic;

  // Determine which mode to use for preview
  const getPreviewSemantic = () => {
    if (previewMode === "light" && hasLightMode) {
      return colorModes.light.semantic;
    }
    if (previewMode === "dark" && hasDarkMode) {
      return colorModes.dark.semantic;
    }
    // Fallback to whatever is available
    if (hasLightMode) return colorModes.light.semantic;
    if (hasDarkMode) return colorModes.dark.semantic;
    return {};
  };

  const semantic = getPreviewSemantic() as Record<string, string>;
  const palette = draft.brand.colors?.primitives?.palette as Record<string, string> || {};

  /* ==========================
     Preview-only button theming
  ========================== */
  const [buttonBgToken, setButtonBgToken] = useState<string>("");
  const [buttonTextToken, setButtonTextToken] = useState<string>("");

  // Initialize button tokens when semantic colors are available
  useEffect(() => {
    if (Object.keys(semantic).length > 0) {
      // Try to find appropriate defaults
      const primaryToken = semantic.primary || Object.values(semantic)[0] || "";
      const textToken = semantic.textPrimary || semantic.textSecondary || Object.values(semantic)[0] || "";

      setButtonBgToken(primaryToken);
      setButtonTextToken(textToken);
    }
  }, [semantic]);

  const buttonBg = buttonBgToken ? (palette[buttonBgToken] || buttonBgToken) : "#3B82F6";
  const buttonText = buttonTextToken ? (palette[buttonTextToken] || buttonTextToken) : "#FFFFFF";

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
          {/* Variant switch (desktop/mobile) */}
          <div className="flex gap-2 bg-gray-900 rounded-full p-1">
            {(["desktop", "mobile"] as const).map((bp) => (
              <button
                key={bp}
                onClick={() => setVariant(bp)}
                className={`px-4 py-1.5 rounded-full text-sm transition
                  ${variant === bp
                    ? "bg-emerald-500 text-black"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {bp}
              </button>
            ))}
          </div>

          {/* Light/Dark mode switch - only show if both modes exist */}
          {hasLightMode && hasDarkMode && (
            <div className="flex gap-2 bg-gray-900 rounded-full p-1">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-4 py-1.5 rounded-full text-sm transition
                    ${previewMode === mode
                      ? "bg-emerald-500 text-black"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}

          {/* Button background selector */}
          {Object.keys(semantic).length > 0 && (
            <>
              <select
                value={buttonBgToken}
                onChange={(e) => setButtonBgToken(e.target.value)}
                className="bg-gray-900 text-white text-sm rounded px-2 py-1 border border-gray-700"
              >
                {Object.entries(semantic).map(([key, token]) => (
                  <option key={key} value={token}>
                    Button BG · {key}
                  </option>
                ))}
              </select>

              {/* Button text selector */}
              <select
                value={buttonTextToken}
                onChange={(e) => setButtonTextToken(e.target.value)}
                className="bg-gray-900 text-white text-sm rounded px-2 py-1 border border-gray-700"
              >
                {Object.entries(semantic).map(([key, token]) => (
                  <option key={key} value={token}>
                    Button Text · {key}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Mode indicator for themes with only one mode */}
          {!hasLightMode && hasDarkMode && (
            <div className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
              Dark Mode Only
            </div>
          )}
          {hasLightMode && !hasDarkMode && (
            <div className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400">
              Light Mode Only
            </div>
          )}
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