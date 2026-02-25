// src/sections/Preview/blocks/LogoPreviewBlock.tsx
import { useBrandStore } from "../../../store/brandStore";

export default function LogoPreviewBlock() {
  const { draft } = useBrandStore();
  const logo = draft.brand.identity.logo;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Logos
      </h2>

      <div className="flex gap-10">
        <img src={logo.light.primary} className="h-12" />
        <div className="bg-white p-4 rounded">
          <img src={logo.dark.primary} className="h-12" />
        </div>
      </div>
    </section>
  );
}