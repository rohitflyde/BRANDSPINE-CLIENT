// src/sections/Layout/LayoutRow.tsx
import { useBrandStore } from "../../store/brandStore";
import LayoutNumberInput from "./LayoutNumberInput";
import { breakpoints } from "./layoutConfig";

export default function LayoutRow({ token }: any) {
  const { draft, updateDraft } = useBrandStore();

  // Resolve base object from brand using token.path
  const base =
    token.path.reduce(
      (acc: any, key: any) => acc?.[key],
      draft?.brand
    ) ?? {};

  return (
    <div className="grid grid-cols-[2fr_repeat(4,1fr)] items-center px-4 py-3 border-t border-white/10">
      <div className="text-sm text-white/80">
        {token.label}
      </div>

      {breakpoints.map((bp) => {
        const value =
          base[bp] ?? base.desktop ?? 0;

        return (
          <LayoutNumberInput
            key={bp}
            value={value}
            onChange={(val) =>
              updateDraft(
                ["brand", ...token.path, bp],
                val
              )
            }
          />
        );
      })}
    </div>
  );
}