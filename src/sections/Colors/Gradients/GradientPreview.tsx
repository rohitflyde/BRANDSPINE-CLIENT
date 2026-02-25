import { useBrandStore } from "../../../store/brandStore";
import { gradientToCss } from "../../../utils/gradientToCss";

type Props = {
  gradient: any;
};

export default function GradientPreview({
  gradient
}: Props) {
  const { draft } = useBrandStore();

  const palette =
    draft.brand.colors.primitives.palette;

  const css = gradientToCss(gradient, palette);

  return (
    <div className="space-y-2">
      <div
        className="h-24 w-full rounded-lg border"
        style={{ background: css }}
      />

      <div className="text-[11px] text-gray-500 font-mono break-all">
        {css}
      </div>
    </div>
  );
}
