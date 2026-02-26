// src/sections/Identity/AppIcon/AppIconEditor.tsx
import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function AppIconEditor() {
  const { draft, updateDraft } = useBrandStore();

  return (
    <div className="max-w-md space-y-6">
      <AssetUpload
        label="App Icon"
        value={draft.brand.identity.appIcon}
        onChange={(url) =>
          updateDraft(
            ["brand", "identity", "appIcon"],
            url
          )
        }
        path={["brand", "identity", "appIcon"]}
        folder="brands/app-icons"
        description="Used for mobile apps, desktop shells, SDKs, and exports. Recommended size: 1024×1024px."
        accept="image/png,image/jpeg,image/svg+xml"
      />

      <div className="grid grid-cols-4 gap-4 mt-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            {draft.brand.identity.appIcon && (
              <img
                src={draft.brand.identity.appIcon}
                alt="App Icon Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">iOS (60×60)</span>
        </div>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            {draft.brand.identity.appIcon && (
              <img
                src={draft.brand.identity.appIcon}
                alt="App Icon Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">Android (72×72)</span>
        </div>
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            {draft.brand.identity.appIcon && (
              <img
                src={draft.brand.identity.appIcon}
                alt="App Icon Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">macOS (128×128)</span>
        </div>
        <div className="text-center">
          <div className="w-32 h-32 mx-auto bg-gray-800 rounded-3xl overflow-hidden border border-gray-700">
            {draft.brand.identity.appIcon && (
              <img
                src={draft.brand.identity.appIcon}
                alt="App Icon Preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">App Store (512×512)</span>
        </div>
      </div>
    </div>
  );
}