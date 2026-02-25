import { useBrandStore } from "../../../store/brandStore";
import GradientPreview from "./GradientPreview";
import GradientStopsEditor from "./GradientStopsEditor";

type Props = {
  gradientKey: string;
  gradient: any;
};

export default function GradientCard({
  gradientKey,
  gradient
}: Props) {


const { updateDraft } = useBrandStore();

function update(nextGradient: any) {
  updateDraft(
    [
      "brand",
      "colors",
      "primitives",
      "gradients",
      gradientKey
    ],
    nextGradient
  );
}

  return (
    <div className="border rounded-xl p-6 space-y-6">
      <h3 className="font-medium">
        {gradientKey}
      </h3>

      <GradientPreview gradient={gradient} />

      {/* Type */}
      <select
        value={gradient.type}
        onChange={(e) =>
          update({
            ...gradient,
            type: e.target.value
          })
        }
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="linear">Linear</option>
        <option value="radial">Radial</option>
      </select>

      {/* Angle (Linear only) */}
      {gradient.type === "linear" && (
        <div>
          <label className="text-xs text-gray-600">
            Angle ({gradient.angle}°)
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={gradient.angle}
            onChange={(e) =>
              update({
                ...gradient,
                angle: Number(
                  e.target.value
                )
              })
            }
          />
        </div>
      )}

      <GradientStopsEditor
        stops={gradient.stops}
        onChange={(stops) =>
          update({ ...gradient, stops })
        }
      />
    </div>
  );
}
