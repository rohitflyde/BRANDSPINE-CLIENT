import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function LogosEditor() {
  const { draft, updateDraft } = useBrandStore();

  const logos = draft.brand.identity.logo;

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Light */}
      <div className="space-y-4">
        <h3 className="font-medium">Light</h3>

        <AssetUpload
          label="Primary Logo"
          value={logos.light.primary}
          onChange={(url) =>
            updateDraft(
              [
                "brand",
                "identity",
                "logo",
                "light",
                "primary"
              ],
              url
            )
          }
        />
      </div>

      {/* Dark */}
      <div className="space-y-4">
        <h3 className="font-medium">Dark</h3>

        <AssetUpload
          label="Primary Logo"
          value={logos.dark.primary}
          onChange={(url) =>
            updateDraft(
              [
                "brand",
                "identity",
                "logo",
                "dark",
                "primary"
              ],
              url
            )
          }
        />
      </div>
    </div>
  );
}