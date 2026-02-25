// src/sections/Colors/SemanticColorGrid.tsx
import { useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import ColorSwatch from "./ColorSwatch";
import ColorPickerPanel from "./ColorPickerPanel";

type Props = {
  mode: "light" | "dark";
};

const GROUPS: Record<string, string[]> = {
  Primary: ["primary"],
  Surface: ["background", "surface"],
  Text: ["textPrimary", "textSecondary"]
};

export default function SemanticColorGrid({ mode }: Props) {
  const { draft } = useBrandStore();

  const [activeColor, setActiveColor] = useState<{
    semanticKey: string;
  } | null>(null);

  if (
    !draft?.brand?.colors?.modes?.[mode]?.semantic ||
    !draft?.brand?.colors?.primitives?.palette
  ) {
    return (
      <div className="text-sm text-gray-500">
        No semantic colors defined for {mode} mode.
      </div>
    );
  }

  const semantic =
    draft.brand.colors.modes[mode].semantic;

  const palette =
    draft.brand.colors.primitives.palette;

  return (
    <div className="flex gap-12">
      {/* LEFT: Color grid */}
      <div className="flex-1 space-y-10">
        {Object.entries(GROUPS).map(
          ([groupLabel, keys]) => (
            <div
              key={groupLabel}
              className="space-y-4"
            >
              <h2 className="text-lg font-medium">
                {groupLabel}
              </h2>

              <div className="flex gap-10">
                {keys.map((semanticKey) => {
                  const token =
                    semantic[semanticKey];
                  const hex =
                    palette[token] ?? token;

                  return (
                    <ColorSwatch
                      key={semanticKey}
                      label={semanticKey}
                      token={token}
                      hex={hex}
                      semanticKey={semanticKey}
                      mode={mode}
                      onEdit={() =>
                        setActiveColor({
                          semanticKey
                        })
                      }
                    />
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* RIGHT: Color picker panel */}
      {activeColor && (
        <ColorPickerPanel
          mode={mode}
          semanticKey={activeColor.semanticKey}
          onClose={() => setActiveColor(null)}
        />
      )}
    </div>
  );
}