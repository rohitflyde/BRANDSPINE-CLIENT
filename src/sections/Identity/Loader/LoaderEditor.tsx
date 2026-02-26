// src/sections/Identity/Loader/LoaderEditor.tsx
import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function LoaderEditor() {
  const { draft, updateDraft } = useBrandStore();

  return (
    <div className="max-w-md space-y-6">
      <AssetUpload
        label="Loader Animation"
        value={draft.brand.identity.loader}
        onChange={(url) =>
          updateDraft(
            ["brand", "identity", "loader"],
            url
          )
        }
        path={["brand", "identity", "loader"]}
        folder="brands/loaders"
        description="GIF, SVG, or Lottie JSON URL for loading animations"
        accept="image/gif,image/svg+xml,application/json"
      />

      {draft.brand.identity.loader && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          {draft.brand.identity.loader.endsWith('.json') ? (
            <div className="text-sm text-gray-400">
              Lottie animation (preview not available)
            </div>
          ) : (
            <img
              src={draft.brand.identity.loader}
              alt="Loader preview"
              className="max-w-full h-auto max-h-32 mx-auto"
            />
          )}
        </div>
      )}
    </div>
  );
}