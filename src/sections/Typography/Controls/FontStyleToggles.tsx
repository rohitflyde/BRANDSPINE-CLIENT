import { useBrandStore } from "../../../store/brandStore";

export default function FontStyleToggles({ styleKey, variant }: any) {
  const { updateDraft } = useBrandStore();

  return (
    <div className="flex gap-2">
      <button
        onClick={() =>
          updateDraft(
            ["brand","typography","textStyles",styleKey,"variants",variant,"fontWeight"],
            700
          )
        }
      >B</button>

      <button
        onClick={() =>
          updateDraft(
            ["brand","typography","textStyles",styleKey,"variants",variant,"fontStyle"],
            "italic"
          )
        }
      >I</button>
    </div>
  );
}