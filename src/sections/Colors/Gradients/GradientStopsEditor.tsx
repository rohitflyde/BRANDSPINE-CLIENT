import GradientStopRow from "./GradientStopRow";

type Stop = {
  color: string;
  position: number;
  opacity?: number;
};

type Props = {
  stops: any;
  onChange: (stops: Stop[]) => void;
};

/**
 * Normalize stops to array
 * (handles legacy object-shaped data)
 */
function normalizeStops(stops: any): Stop[] {
  if (Array.isArray(stops)) return stops;

  if (typeof stops === "object" && stops !== null) {
    return Object.values(stops);
  }

  return [];
}

export default function GradientStopsEditor({
  stops,
  onChange
}: Props) {
  const normalizedStops = normalizeStops(stops);

  function updateStop(index: number, patch: Partial<Stop>) {
    const next = [...normalizedStops];
    next[index] = { ...next[index], ...patch };

    // Always keep stops sorted
    onChange(
      next.sort((a, b) => a.position - b.position)
    );
  }

  function addStop() {
    onChange([
      ...normalizedStops,
      {
        color: normalizedStops[0]?.color,
        position: 50,
        opacity: 1
      }
    ]);
  }

  function removeStop(index: number) {
    if (normalizedStops.length <= 2) return;
    onChange(
      normalizedStops.filter((_, i) => i !== index)
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-gray-600">
        Stops
      </div>

      {normalizedStops.map((stop, i) => (
        <GradientStopRow
          key={i}
          stop={stop}
          onChange={(patch) =>
            updateStop(i, patch)
          }
          onRemove={() => removeStop(i)}
          canRemove={normalizedStops.length > 2}
        />
      ))}

      <button
        onClick={addStop}
        className="text-xs text-violet-500"
      >
        + Add stop
      </button>
    </div>
  );
}
