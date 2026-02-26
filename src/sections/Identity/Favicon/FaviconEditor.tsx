// src/sections/Identity/Favicon/FaviconEditor.tsx
import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function FaviconEditor() {
  const { draft, updateDraft } = useBrandStore();

  const favicon = draft.brand.identity.favicon;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <AssetUpload
          label="Light Favicon"
          value={favicon?.light}
          onChange={(url) =>
            updateDraft(
              ["brand", "identity", "favicon", "light"],
              url
            )
          }
          path={["brand", "identity", "favicon", "light"]}
          folder="brands/favicon"
          description="For light backgrounds (16x16px, 32x32px)"
          accept="image/x-icon,image/png,image/svg+xml"
        />

        <AssetUpload
          label="Dark Favicon"
          value={favicon?.dark}
          onChange={(url) =>
            updateDraft(
              ["brand", "identity", "favicon", "dark"],
              url
            )
          }
          path={["brand", "identity", "favicon", "dark"]}
          folder="brands/favicon"
          description="For dark backgrounds (16x16px, 32x32px)"
          accept="image/x-icon,image/png,image/svg+xml"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <AssetUpload
          label="PNG Favicon"
          value={favicon?.png}
          onChange={(url) =>
            updateDraft(
              ["brand", "identity", "favicon", "png"],
              url
            )
          }
          path={["brand", "identity", "favicon", "png"]}
          folder="brands/favicon"
          description="PNG version for modern browsers"
          accept="image/png"
        />

        <AssetUpload
          label="SVG Favicon"
          value={favicon?.svg}
          onChange={(url) =>
            updateDraft(
              ["brand", "identity", "favicon", "svg"],
              url
            )
          }
          path={["brand", "identity", "favicon", "svg"]}
          folder="brands/favicon"
          description="SVG version for scalability"
          accept="image/svg+xml"
        />
      </div>
    </div>
  );
}