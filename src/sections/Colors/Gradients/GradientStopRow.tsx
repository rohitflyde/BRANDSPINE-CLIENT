import { useBrandStore } from "../../../store/brandStore";

type Props = {
  stop: {
    color: string;    // palette token
    position: number; // 0–100
    opacity?: number; // 0–1
  };
  onChange: (patch: Partial<Props["stop"]>) => void;
  onRemove: () => void;
  canRemove: boolean;
};

export default function GradientStopRow({
  stop,
  onChange,
  onRemove,
  canRemove
}: Props) {
  const { draft } = useBrandStore();

  const palette =
    draft.brand.colors.primitives.palette;

  const hex =
    palette[stop.color] ?? "#000000";

  return (
    <div className="flex items-center gap-4">
      {/* Color preview */}
      <div
        className="w-6 h-6 rounded-full border"
        style={{ backgroundColor: hex }}
      />

      {/* Color token */}
      <select
        value={stop.color}
        onChange={(e) =>
          onChange({ color: e.target.value })
        }
        className="border rounded px-2 py-1 text-sm"
      >
        {Object.keys(palette).map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>

      {/* Position */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={100}
          value={stop.position}
          onChange={(e) =>
            onChange({
              position: Number(e.target.value)
            })
          }
          className="w-16 border rounded px-2 py-1 text-sm"
        />
        <span className="text-xs text-gray-500">
          %
        </span>
      </div>

      {/* Opacity */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={stop.opacity ?? 1}
          onChange={(e) =>
            onChange({
              opacity: Number(e.target.value)
            })
          }
          className="w-16 border rounded px-2 py-1 text-sm"
        />
        <span className="text-xs text-gray-500">
          α
        </span>
      </div>

      {/* Remove */}
      {canRemove && (
        <button
          onClick={onRemove}
          className="text-xs text-red-500 hover:underline ml-auto"
        >
          Remove
        </button>
      )}
    </div>
  );
}
