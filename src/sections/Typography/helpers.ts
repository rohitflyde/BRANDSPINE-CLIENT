export function resolveVariant(style: any, variant: string) {
  const order = ["desktop", "tablet", "mobile"];

  const index = order.indexOf(variant);
  for (let i = index; i >= 0; i--) {
    const v = style.variants[order[i]];
    if (v) return v;
  }

  return {};
}

// src/sections/Typography/helpers.ts
export function getVariant(
  style: any,
  variant: "desktop" | "tablet" | "mobile"
) {
  return style.variants?.[variant] ?? {};
}


export function getInheritanceSource(
  style: any,
  variant: "desktop" | "tablet" | "mobile",
  key: string
): "desktop" | "tablet" | null {
  const order = ["desktop", "tablet", "mobile"];
  const index = order.indexOf(variant);

  // If explicitly set at this level → no inheritance
  if (style.variants?.[variant]?.[key] !== undefined) {
    return null;
  }

  // Walk up the chain
  for (let i = index - 1; i >= 0; i--) {
    const v = order[i];
    if (style.variants?.[v]?.[key] !== undefined) {
      return v as any;
    }
  }

  return null;
}
