// src/sections/Typography/helpers.ts
export const createNewTypographyStyle = (
  fontFamilies: Record<string, any>,
  label: string = "New Style"
) => {
  // Get first available font family
  const fontFamilyKeys = Object.keys(fontFamilies);
  const firstFontFamily = fontFamilyKeys[0] || 'primary';

  return {
    label: label,
    editable: true,
    variants: {
      desktop: {
        fontFamily: firstFontFamily,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 400,
        letterSpacing: 0,
        alignment: "left",
        case: "none",
        decoration: "none",
        italic: false
      },
      mobile: {
        fontFamily: firstFontFamily,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 400,
        letterSpacing: 0,
        alignment: "left",
        case: "none",
        decoration: "none",
        italic: false
      }
    }
  };
};

export const resolveVariant = (style: any, variant: "desktop" | "mobile") => {
  const base = style.variants?.desktop || {};
  const specific = style.variants?.[variant] || {};

  return {
    ...base,
    ...specific
  };
};

export const getTypographyStyle = (
  typography: any,
  styleKey: string,
  variant: "desktop" | "mobile"
) => {
  const style = typography?.textStyles?.[styleKey];
  if (!style) return null;

  return resolveVariant(style, variant);
};