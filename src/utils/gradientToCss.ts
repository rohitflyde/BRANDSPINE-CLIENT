function normalizeStops(stops: any) {
  if (Array.isArray(stops)) return stops;

  if (typeof stops === "object" && stops !== null) {
    return Object.values(stops);
  }

  return [];
}

export function gradientToCss(
  gradient: any,
  palette: Record<string, string>
) {
  const stops = normalizeStops(gradient.stops);

  if (!stops.length) {
    return "transparent";
  }

  const stopStrings = stops
    .map((s: any) => {
      const hex = palette[s.color] ?? "#000000";
      const alpha =
        s.opacity !== undefined ? s.opacity : 1;

      // convert alpha → hex suffix if needed
      const color =
        alpha < 1
          ? `${hex}${Math.round(alpha * 255)
              .toString(16)
              .padStart(2, "0")}`
          : hex;

      return `${color} ${s.position}%`;
    })
    .join(", ");

  if (gradient.type === "radial") {
    return `radial-gradient(${stopStrings})`;
  }

  return `linear-gradient(${gradient.angle ?? 0}deg, ${stopStrings})`;
}
