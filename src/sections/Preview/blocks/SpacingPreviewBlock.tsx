// src/sections/Preview/blocks/SpacingPreviewBlock.tsx
import { useBrandStore } from "../../../store/brandStore";

type Props = {
  variant: "desktop" | "mobile";
};

export default function SpacingPreviewBlock({
  variant
}: Props) {
  const { draft } = useBrandStore();

  const spacing =
    draft.brand.layout.spacing;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Spacing
      </h2>

      <div className="space-y-4">
        {Object.entries(spacing).map(
          ([key, value]: any) => {
            const v =
              value?.[variant] ??
              value?.desktop;

            return (
              <div key={key} className="space-y-1">
                <div className="text-xs text-gray-400">
                  {key}: {v}px
                </div>
                <div
                  style={{
                    height: v,
                    background:
                      "linear-gradient(to right, #444, #222)"
                  }}
                />
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}