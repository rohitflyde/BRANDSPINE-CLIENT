import { useBrandStore } from "../../../store/brandStore";
import GradientCard from "./GradientCard";

export default function GradientsEditor() {
  const { draft } = useBrandStore();

  const gradients =
    draft.brand.colors.primitives.gradients;

  return (
    <div className="space-y-10">
      {Object.entries(gradients).map(
        ([key, gradient]: any) => (
          <GradientCard
            key={key}
            gradientKey={key}
            gradient={gradient}
          />
        )
      )}
    </div>
  );
}
