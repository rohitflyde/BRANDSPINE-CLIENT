import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function AppIconEditor() {
  const { draft, updateDraft } = useBrandStore();

  return (
    <div className="max-w-md space-y-6">
      <AssetUpload
        label="App Icon (Square PNG / SVG)"
        value={draft.brand.identity.appIcon}
        onChange={(url) =>
          updateDraft(
            ["brand", "identity", "appIcon"],
            url
          )
        }
      />

      <div className="text-xs text-gray-500">
        Used for mobile apps, desktop shells, SDKs,
        and exports. Recommended size: 1024×1024.
      </div>
    </div>
  );
}