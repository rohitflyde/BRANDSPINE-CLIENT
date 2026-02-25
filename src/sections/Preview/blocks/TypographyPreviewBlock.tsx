// src/sections/Preview/blocks/TypographyPreviewBlock.tsx
import { useBrandStore } from "../../../store/brandStore";

type Props = {
  variant: "desktop" | "mobile";
};

export default function TypographyPreviewBlock({
  variant
}: Props) {
  const { draft } = useBrandStore();
  const typography = draft.brand.typography;

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold">
        Typography
      </h2>

      <div className="space-y-6">
        {Object.entries(typography.textStyles).map(
          ([key, style]: any) => {
            const v =
              style.variants?.[variant] ??
              style.variants.desktop;

            const font =
              typography.primitives.fontFamilies[
                v.fontFamily
              ];

            return (
              <div key={key} className="space-y-1">
                <div
                  style={{
                    fontFamily: `"${font.family}", ${font.fallback.join(",")}`,
                    fontSize: v.fontSize,
                    lineHeight: `${v.lineHeight}px`,
                    fontWeight: v.fontWeight,
                    textTransform: v.case
                  }}
                >
                  {style.label} – The quick brown fox jumps over the lazy dog
                </div>

                <div className="text-xs text-gray-400">
                  {variant} · {font.label} · {v.fontSize}px / {v.lineHeight}px · {v.fontWeight}
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}