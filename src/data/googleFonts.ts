export interface GoogleFont {
  key: string;
  label: string;
  family: string;
  weights: number[];
}

export const GOOGLE_FONTS: GoogleFont[] = [
  // ─────────────────────────────
  // Modern SaaS / UI Fonts
  // ─────────────────────────────
  {
    key: "inter",
    label: "Inter",
    family: "Inter",
    weights: [300, 400, 500, 600, 700]
  },
  {
    key: "manrope",
    label: "Manrope",
    family: "Manrope",
    weights: [300, 400, 500, 600, 700]
  },
  {
    key: "dmSans",
    label: "DM Sans",
    family: "DM Sans",
    weights: [400, 500, 700]
  },
  {
    key: "plusJakartaSans",
    label: "Plus Jakarta Sans",
    family: "Plus Jakarta Sans",
    weights: [300, 400, 500, 600, 700]
  },
  {
    key: "workSans",
    label: "Work Sans",
    family: "Work Sans",
    weights: [300, 400, 500, 600, 700]
  },

  // ─────────────────────────────
  // Friendly / Rounded UI
  // ─────────────────────────────
  {
    key: "nunito",
    label: "Nunito",
    family: "Nunito",
    weights: [300, 400, 600, 700]
  },
  {
    key: "poppins",
    label: "Poppins",
    family: "Poppins",
    weights: [300, 400, 500, 600, 700]
  },

  // ─────────────────────────────
  // Corporate / Neutral
  // ─────────────────────────────
  {
    key: "lato",
    label: "Lato",
    family: "Lato",
    weights: [300, 400, 700]
  },
  {
    key: "sourceSans3",
    label: "Source Sans 3",
    family: "Source Sans 3",
    weights: [300, 400, 600, 700]
  },
  {
    key: "roboto",
    label: "Roboto",
    family: "Roboto",
    weights: [300, 400, 500, 700]
  },
  {
    key: "ibmPlexSans",
    label: "IBM Plex Sans",
    family: "IBM Plex Sans",
    weights: [300, 400, 500, 600, 700]
  },
  {
    key: "ubuntu",
    label: "Ubuntu",
    family: "Ubuntu",
    weights: [300, 400, 500, 700]
  },
  {
    key: "notoSans",
    label: "Noto Sans",
    family: "Noto Sans",
    weights: [300, 400, 500, 700]
  },

  // ─────────────────────────────
  // Editorial / Premium Serif
  // ─────────────────────────────
  {
    key: "playfairDisplay",
    label: "Playfair Display",
    family: "Playfair Display",
    weights: [400, 500, 600, 700]
  },
  {
    key: "libreBaskerville",
    label: "Libre Baskerville",
    family: "Libre Baskerville",
    weights: [400, 700]
  },
  {
    key: "sourceSerif4",
    label: "Source Serif 4",
    family: "Source Serif 4",
    weights: [400, 600, 700]
  },
  {
    key: "merriweather",
    label: "Merriweather",
    family: "Merriweather",
    weights: [300, 400, 700]
  }
];