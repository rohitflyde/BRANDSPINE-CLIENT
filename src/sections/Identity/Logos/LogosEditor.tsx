// src/sections/Identity/Logos/LogosEditor.tsx
import { useBrandStore } from "../../../store/brandStore";
import AssetUpload from "../AssetUpload";

export default function LogosEditor() {
  const { draft, updateDraft } = useBrandStore();

  const logos = draft.brand.identity.logo;

  return (
    <div className="space-y-8">
      {/* Light Mode Logos */}
      <div>
        <h3 className="text-lg font-medium mb-4">Light Mode</h3>
        <div className="grid grid-cols-2 gap-8">
          <AssetUpload
            label="Primary Logo (Light)"
            value={logos?.light?.primary}
            onChange={(url) =>
              updateDraft(
                ["brand", "identity", "logo", "light", "primary"],
                url
              )
            }
            path={["brand", "identity", "logo", "light", "primary"]}
            folder="brands/logos/light"
            description="Main logo for light backgrounds"
          />

          <AssetUpload
            label="Secondary Logo (Light)"
            value={logos?.light?.secondary}
            onChange={(url) =>
              updateDraft(
                ["brand", "identity", "logo", "light", "secondary"],
                url
              )
            }
            path={["brand", "identity", "logo", "light", "secondary"]}
            folder="brands/logos/light"
            description="Alternate logo for light backgrounds"
          />
        </div>
      </div>

      {/* Dark Mode Logos */}
      <div>
        <h3 className="text-lg font-medium mb-4">Dark Mode</h3>
        <div className="grid grid-cols-2 gap-8">
          <AssetUpload
            label="Primary Logo (Dark)"
            value={logos?.dark?.primary}
            onChange={(url) =>
              updateDraft(
                ["brand", "identity", "logo", "dark", "primary"],
                url
              )
            }
            path={["brand", "identity", "logo", "dark", "primary"]}
            folder="brands/logos/dark"
            description="Main logo for dark backgrounds"
          />

          <AssetUpload
            label="Secondary Logo (Dark)"
            value={logos?.dark?.secondary}
            onChange={(url) =>
              updateDraft(
                ["brand", "identity", "logo", "dark", "secondary"],
                url
              )
            }
            path={["brand", "identity", "logo", "dark", "secondary"]}
            folder="brands/logos/dark"
            description="Alternate logo for dark backgrounds"
          />
        </div>
      </div>
    </div>
  );
}