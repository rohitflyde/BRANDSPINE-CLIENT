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


export function loadBrandFonts(fontFamilies: any) {
  const styleId = "brand-font-faces";
  if (document.getElementById(styleId)) return;

  let css = "";

  Object.values(fontFamilies).forEach((font: any) => {
    if (!font.sources) return;

    font.sources.forEach((src: any) => {
      css += `
@font-face {
  font-family: '${font.family}';
  src:
    ${src.woff2 ? `url('${src.woff2}') format('woff2'),` : ""}
    ${src.woff ? `url('${src.woff}') format('woff')` : ""};
  font-weight: ${src.weight};
  font-style: ${src.style || "normal"};
  font-display: swap;
}
`;
    });
  });

  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = css;
  document.head.appendChild(style);
}