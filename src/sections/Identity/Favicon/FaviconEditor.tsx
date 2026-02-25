import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function FaviconEditor() {
  const { draft, updateDraft } = useBrandStore();

  const favicon = draft.brand.identity.favicon;

  return (
    <div className="grid grid-cols-2 gap-8">
      <AssetUpload
        label="Light Favicon"
        value={favicon.light}
        onChange={(url) =>
          updateDraft(
            ["brand", "identity", "favicon", "light"],
            url
          )
        }
      />

      <AssetUpload
        label="Dark Favicon"
        value={favicon.dark}
        onChange={(url) =>
          updateDraft(
            ["brand", "identity", "favicon", "dark"],
            url
          )
        }
      />
    </div>
  );
}