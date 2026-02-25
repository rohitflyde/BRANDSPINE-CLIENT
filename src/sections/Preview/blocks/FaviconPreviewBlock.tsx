// src/sections/Preview/blocks/FaviconPreviewBlock.tsx
import { useBrandStore } from "../../../store/brandStore";

export default function FaviconPreviewBlock() {
  const { draft } = useBrandStore();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Favicon
      </h2>

      <div className="flex items-center gap-4">
        <img
          src={draft.brand.identity.favicon.light}
          className="h-8 w-8"
        />
        <span className="text-sm text-gray-400">
          Browser tab preview
        </span>
      </div>
    </section>
  );
}