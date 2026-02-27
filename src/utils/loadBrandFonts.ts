// // src/utils/loadBrandFonts.ts
// import { loadGoogleFont } from "./loadGoogleFont";

// interface FontSource {
//   weight: number;
//   style?: string;
//   woff2?: string;
//   woff?: string;
// }

// interface FontFamily {
//   family: string;
//   sources?: FontSource[];
// }

// export function loadBrandFonts(
//   fontFamilies: Record<string, FontFamily>
// ) {
//   if (typeof document === "undefined") return;

//   const STYLE_ID = "brand-font-faces";

//   let styleEl = document.getElementById(
//     STYLE_ID
//   ) as HTMLStyleElement | null;

//   if (!styleEl) {
//     styleEl = document.createElement("style");
//     styleEl.id = STYLE_ID;
//     document.head.appendChild(styleEl);
//   }

//   const rules: string[] = [];

// Object.values(fontFamilies).forEach(
//   ({ family, sources }) => {
//     // If NO sources → assume Google Font
//     if (!sources?.length && family) {
//       loadGoogleFont(family, [400, 500, 600, 700]);
//       return;
//     }
//       if (!family || !sources?.length) return;

//       sources.forEach((src) => {
//         const urls: string[] = [];

//         if (src.woff2) {
//           urls.push(
//             `url("${src.woff2}") format("woff2")`
//           );
//         }

//         if (src.woff) {
//           urls.push(
//             `url("${src.woff}") format("woff")`
//           );
//         }

//         if (!urls.length) return;

//         rules.push(`
// @font-face {
//   font-family: "${family}";
//   font-style: ${src.style || "normal"};
//   font-weight: ${src.weight};
//   font-display: swap;
//   src: ${urls.join(", ")};
// }`);
//       });
//     }
//   );

//   styleEl.innerHTML = rules.join("\n");
// }


// src/utils/loadBrandFonts.ts
export const loadBrandFonts = async (fontFamilies: Record<string, any>) => {
  if (!fontFamilies) return;

  const promises = Object.entries(fontFamilies).map(async ([key, font]) => {
    if (!font.sources || font.sources.length === 0) return;

    // Create a FontFace for each source
    const fontFaces = font.sources.map((source: any) => {
      // Determine the format based on available URLs
      let sourceUrl = '';
      let format = '';

      if (source.woff2) {
        sourceUrl = source.woff2;
        format = 'woff2';
      } else if (source.woff) {
        sourceUrl = source.woff;
        format = 'woff';
      } else if (source.ttf) {
        sourceUrl = source.ttf;
        format = 'truetype';
      }

      if (!sourceUrl) return null;

      const fontFace = new FontFace(
        font.family,
        `url(${sourceUrl}) format('${format}')`,
        {
          weight: source.weight.toString(),
          style: source.style,
          display: 'swap'
        }
      );

      return fontFace;
    }).filter(Boolean);

    // Load all font faces
    await Promise.all(
      fontFaces.map(async (fontFace: FontFace) => {
        try {
          await fontFace.load();
          document.fonts.add(fontFace);
          console.log(`✅ Loaded font: ${font.family} (${fontFace.weight} ${fontFace.style})`);
        } catch (error) {
          console.error(`❌ Failed to load font: ${font.family}`, error);
        }
      })
    );
  });

  await Promise.all(promises);
};