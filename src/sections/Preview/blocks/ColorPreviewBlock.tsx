import { useBrandStore } from "../../../store/brandStore";

export default function ColorPreviewBlock() {
  const { draft } = useBrandStore();

  const semantic =
    draft.brand.colors.modes.light.semantic as Record<string, string>;

  const palette =
    draft.brand.colors.primitives.palette as Record<string, string>;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Colors
      </h2>

      <div className="flex gap-6 flex-wrap">
        {Object.entries(semantic).map(
          ([key, token]) => {
            const hex = palette[token];

            return (
              <div
                key={key}
                className="w-40 rounded-lg p-4"
                style={{ background: hex }}
              >
                <div className="text-black text-sm font-medium">
                  {key}
                </div>
                <div className="text-black/70 text-xs">
                  {hex}
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}