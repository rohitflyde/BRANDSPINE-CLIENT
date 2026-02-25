// src/utils/generateBrandCss.ts
export function generateBrandCss(brand: any): string {
  const lines: string[] = [];

  /* =====================
     COLORS
  ===================== */
  const palette = brand.colors.primitives.palette;
  const semanticLight = brand.colors.modes.light.semantic;

  lines.push(":root {");

  Object.entries(palette).forEach(([key, value]: any) => {
    lines.push(`  --color-${key}: ${value};`);
  });

  Object.entries(semanticLight).forEach(
    ([key, token]: any) => {
      lines.push(
        `  --color-${key}: var(--color-${token});`
      );
    }
  );

  lines.push("}");

  /* =====================
     TYPOGRAPHY
  ===================== */
  Object.entries(brand.typography.textStyles).forEach(
    ([key, style]: any) => {
      const d = style.variants.desktop;
      const m =
        style.variants.mobile ??
        style.variants.desktop;

      lines.push("");
      lines.push(`.text-${key} {`);
      lines.push(
        `  font-family: ${brand.typography.primitives.fontFamilies[d.fontFamily].family};`
      );
      lines.push(`  font-size: ${d.fontSize}px;`);
      lines.push(`  line-height: ${d.lineHeight}px;`);
      lines.push(`  font-weight: ${d.fontWeight};`);
      lines.push("}");

      lines.push(`@media (max-width: 768px) {`);
      lines.push(`  .text-${key} {`);
      lines.push(`    font-size: ${m.fontSize}px;`);
      lines.push(
        `    line-height: ${m.lineHeight}px;`
      );
      if (m.fontWeight)
        lines.push(
          `    font-weight: ${m.fontWeight};`
        );
      lines.push("  }");
      lines.push("}");
    }
  );

  /* =====================
     SPACING
  ===================== */
  Object.entries(brand.layout.spacing).forEach(
    ([key, value]: any) => {
      lines.push(
        `--space-${key}: ${value.desktop}px;`
      );
    }
  );

  /* =====================
     BUTTON EXAMPLE
  ===================== */
  lines.push("");
  lines.push(".btn-primary {");
  lines.push(
    "  background: var(--color-primary);"
  );
  lines.push(
    "  color: var(--color-textPrimary);"
  );
  lines.push(
    "  padding: 12px 24px;"
  );
  lines.push("  border-radius: 8px;");
  lines.push("}");

  return lines.join("\n");
}