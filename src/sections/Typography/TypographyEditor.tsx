// src/sections/Typography/TypographyEditor.tsx
import { useEffect, useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import StyleList from "./StyleList";
import VariantTabs from "./VariantTabs";
import TypographyToolbar from "./TypographyToolbar";
import Preview from "./Preview";

export default function TypographyEditor() {
  const { draft, saveBrand, isDirty, loading } =
    useBrandStore();

  const styles = draft.brand.typography.textStyles;
  const keys = Object.keys(styles);

  const [activeStyle, setActiveStyle] =
    useState<string>("");

  // ✅ FIXED: only desktop | mobile
  const [variant, setVariant] =
    useState<"desktop" | "mobile">("desktop");

  const [previewText, setPreviewText] =
    useState(
      "The quick brown fox jumps over the lazy dog"
    );

  useEffect(() => {
    if (!activeStyle && keys.length) {
      setActiveStyle(keys[0]);
    }
  }, [keys, activeStyle]);

  if (!activeStyle) return null;

  return (
    <div className="flex h-full">
      <StyleList
        styles={styles}
        active={activeStyle}
        onSelect={setActiveStyle}
      />

      <div className="flex-1 p-8 space-y-6">
        <div className="flex justify-between items-center">
          <VariantTabs
            value={variant}
            onChange={setVariant}
          />

          <button
            onClick={saveBrand}
            disabled={!isDirty || loading}
            className={`px-4 py-2 rounded-lg text-sm
              ${
                isDirty
                  ? "bg-emerald-500 text-black"
                  : "bg-gray-800 text-gray-500"
              }`}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>

        <TypographyToolbar
          styleKey={activeStyle}
          variant={variant}
          previewText={previewText}
          onChangePreviewText={setPreviewText}
        />

        <Preview
          styleKey={activeStyle}
          variant={variant}
          text={previewText}
        />
      </div>
    </div>
  );
}