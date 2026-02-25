import { useBrandStore } from "../../../store/brandStore";
import { resolveVariant } from "../helpers";

export default function LineHeightInput({ styleKey, variant }: any) {
  const { draft, updateDraft } = useBrandStore();
  const style = draft.brand.typography.textStyles[styleKey];
  const resolved = resolveVariant(style, variant);

  return (
    <div className="flex items-center gap-2 bg-black border border-gray-800 rounded-lg px-3 h-10">
      <input
        className="w-14 bg-transparent text-center text-sm outline-none"
        placeholder={resolved.lineHeight?.toString()}
        onChange={(e) =>
          updateDraft(
            ["brand","typography","textStyles",styleKey,"variants",variant,"lineHeight"],
            Number(e.target.value)
          )
        }
      />
    </div>
  );
}
