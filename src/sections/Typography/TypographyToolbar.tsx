// src/sections/Typography/TypographyToolbar.tsx
import { useBrandStore } from "../../store/brandStore";

import FontFamilySelect from "./Controls/FontFamilySelect";
import FontSizeInput from "./Controls/FontSizeInput";
import FontWeightSelect from "./Controls/FontWeightSelect";
import LineHeightInput from "./Controls/LineHeightInput";
import LetterSpacingInput from "./Controls/LetterSpacingInput";
import FontStyleToggles from "./Controls/FontStyleToggles";
import TextStyleToggles from "./Controls/TextStyleToggles";
import DecorationSelect from "./Controls/DecorationSelect";

export default function TypographyToolbar({
  styleKey,
  variant,
  previewText,
  onChangePreviewText
}: {
  styleKey: string;
  variant: "desktop" | "mobile"; // ✅ FIXED
  previewText: string;
  onChangePreviewText: (v: string) => void;
}) {
  const { draft } = useBrandStore();

  const style =
    draft?.brand?.typography?.textStyles?.[styleKey];

  if (!style) return null;

  return (
    <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6">
      <div className="grid grid-cols-[1fr_320px] gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FontFamilySelect
              styleKey={styleKey}
              variant={variant}
            />
            <FontSizeInput
              styleKey={styleKey}
              variant={variant}
            />
            <FontWeightSelect
              styleKey={styleKey}
              variant={variant}
            />
            <LineHeightInput
              styleKey={styleKey}
              variant={variant}
            />
            <LetterSpacingInput
              styleKey={styleKey}
              variant={variant}
            />
          </div>

          <div className="h-px bg-gray-800" />

          <div className="flex flex-wrap gap-6">
            <FontStyleToggles
              styleKey={styleKey}
              variant={variant}
            />

            <TextStyleToggles
              styleKey={styleKey}
              variant={variant}
              mode="alignment"
            />

            <DecorationSelect
              styleKey={styleKey}
              variant={variant}
            />

            <TextStyleToggles
              styleKey={styleKey}
              variant={variant}
              mode="case"
            />
          </div>
        </div>

        {/* Preview Text */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-wide text-gray-500">
            Preview Text
          </span>
          <textarea
            value={previewText}
            onChange={(e) =>
              onChangePreviewText(e.target.value)
            }
            className="
              flex-1 min-h-[160px]
              bg-black border border-gray-800
              rounded-xl p-4 text-sm
              resize-none
              focus:outline-none focus:border-emerald-500
            "
          />
        </div>
      </div>
    </div>
  );
}