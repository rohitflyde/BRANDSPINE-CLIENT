import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function LoaderEditor() {
  const { draft, updateDraft } = useBrandStore();

  return (
    <AssetUpload
      label="Loader Asset (GIF / SVG / Lottie URL)"
      value={draft.brand.identity.loader}
      onChange={(url) =>
        updateDraft(
          ["brand", "identity", "loader"],
          url
        )
      }
    />
  );
}