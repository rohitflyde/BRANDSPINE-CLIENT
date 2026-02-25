import { useBrandStore } from "../../../store/brandStore";
import { GOOGLE_FONTS } from "../../../data/googleFonts";
import { loadGoogleFont } from "../../../utils/loadGoogleFont";

type Props = {
  styleKey: string;
  variant: "desktop" | "mobile";
};

export default function FontFamilySelect({
  styleKey,
  variant
}: Props) {
  const { draft, updateDraft } = useBrandStore();

  const fontFamilies =
    draft.brand.typography.primitives.fontFamilies as Record<
      string,
      {
        label: string;
        family: string;
        fallback: string[];
      }
    >;

  function handleChange(value: string) {
    if (value.startsWith("google:")) {
      const key = value.replace("google:", "");
      const font = GOOGLE_FONTS.find(
        (f) => f.key === key
      );

      if (!font) return;

      loadGoogleFont(font.family, font.weights);

      updateDraft(
        [
          "brand",
          "typography",
          "textStyles",
          styleKey,
          "variants",
          variant,
          "fontFamily"
        ],
        key
      );

      return;
    }

    updateDraft(
      [
        "brand",
        "typography",
        "textStyles",
        styleKey,
        "variants",
        variant,
        "fontFamily"
      ],
      value
    );
  }

  return (
    <select
      onChange={(e) => handleChange(e.target.value)}
      className="bg-black border border-gray-800 rounded-lg px-3 h-10 text-white"
    >
      <optgroup label="Brand Fonts">
        {Object.entries(fontFamilies).map(
          ([key, font]) => (
            <option key={key} value={key}>
              {font.label}
            </option>
          )
        )}
      </optgroup>

      <optgroup label="Google Fonts">
        {GOOGLE_FONTS.map((font) => (
          <option
            key={font.key}
            value={`google:${font.key}`}
            onMouseEnter={() =>
              loadGoogleFont(
                font.family,
                font.weights
              )
            }
          >
            {font.label}
          </option>
        ))}
      </optgroup>
    </select>
  );
}