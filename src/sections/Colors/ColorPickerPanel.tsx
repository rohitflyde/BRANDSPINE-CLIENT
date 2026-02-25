// src/sections/Colors/ColorPickerPanel.tsx
import { useBrandStore } from "../../store/brandStore";

type Props = {
  mode: "light" | "dark";
  semanticKey: string;
  onClose: () => void;
};

export default function ColorPickerPanel({
  mode,
  semanticKey,
  onClose
}: Props) {
  const { draft, updateDraft } = useBrandStore();

  if (!draft?.brand?.colors) return null;

  const palette =
    draft.brand.colors.primitives.palette;

  const semantic =
    draft.brand.colors.modes[mode].semantic;

  // Semantic token (fixed mapping)
  const token = semantic[semanticKey];

  // Actual editable value
  const hex = palette[token];

  function updatePaletteColor(newHex: string) {
    updateDraft(
      ["brand", "colors", "primitives", "palette", token],
      newHex
    );
  }

  return (
    <div className="w-[360px] rounded-xl bg-white text-black p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">
          Edit {semanticKey}
        </h3>

        <button
          onClick={onClose}
          className="text-sm text-gray-500"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Color Picker */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Color value
          </label>

          <input
            type="color"
            value={hex}
            onChange={(e) =>
              updatePaletteColor(e.target.value)
            }
            className="w-full h-32 rounded-lg border"
          />
        </div>

        {/* Read-only token info */}
        <div className="text-xs text-gray-600 space-y-1">
          <div>
            Token:{" "}
            <span className="font-mono">{token}</span>
          </div>
          <div>
            HEX:{" "}
            <span className="font-mono">{hex}</span>
          </div>
          <div className="text-[11px] text-gray-400">
            This token is used by{" "}
            <span className="font-medium">
              {semanticKey}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}