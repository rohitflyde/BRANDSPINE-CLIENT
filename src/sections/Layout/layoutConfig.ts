// src/sections/Layout/layoutConfig.ts

/**
 * Breakpoints used across layout editor
 * Order matters (left → right in UI)
 */
export const breakpoints = [
  "desktop",
  "laptop",
  "tablet",
  "mobile"
] as const;

export type Breakpoint = (typeof breakpoints)[number];

/**
 * Layout token configuration
 * This drives the entire Layout editor UI
 */
export const layoutGroups = [
  {
    id: "spacing",
    title: "Spacing",
    description: "Vertical & horizontal rhythm across the interface",
    tokens: [
      {
        key: "sectionGap",
        label: "Vertical Spacing Between Sections",
        path: ["layout", "spacing", "semantic", "sectionGap"]
      },
      {
        key: "sectionPadding",
        label: "Section Internal Padding",
        path: ["layout", "spacing", "semantic", "sectionPadding"]
      },
      {
        key: "containerPadding",
        label: "Container Padding",
        path: ["layout", "spacing", "semantic", "containerPadding"]
      },
      {
        key: "cardPadding",
        label: "Card Padding",
        path: ["layout", "spacing", "semantic", "cardPadding"]
      },
      {
        key: "buttonPaddingSm",
        label: "Button Padding (Small)",
        path: ["layout", "spacing", "semantic", "buttonPaddingSm"]
      },
      {
        key: "inputPadding",
        label: "Input Field Padding",
        path: ["layout", "spacing", "semantic", "inputPadding"]
      },
      {
        key: "headingMarginH1",
        label: "H1 Headings Margin",
        path: ["layout", "spacing", "semantic", "headingMarginH1"]
      }
    ]
  },

  {
    id: "sizing",
    title: "Sizing",
    description: "Fixed dimensions for structural elements",
    tokens: [
      {
        key: "tableRowHeight",
        label: "Table Row Height",
        path: ["layout", "sizing", "semantic", "tableRowHeight"]
      },
      {
        key: "navbarHeight",
        label: "Navbar Height",
        path: ["layout", "sizing", "semantic", "navbarHeight"]
      },
      {
        key: "navbarItemSpacing",
        label: "Navbar Item Spacing",
        path: ["layout", "sizing", "semantic", "navbarItemSpacing"]
      },
      {
        key: "iconTextGap",
        label: "Icon Padding From Text",
        path: ["layout", "sizing", "semantic", "iconTextGap"]
      },
      {
        key: "iconOnlyButtonPadding",
        label: "Icon-Only Button Padding",
        path: ["layout", "sizing", "semantic", "iconOnlyButtonPadding"]
      },
      {
        key: "iconSizeRegular",
        label: "Icon Size – Regular",
        path: ["layout", "sizing", "semantic", "iconSizeRegular"]
      },
      {
        key: "iconSizeLarge",
        label: "Icon Size – Large",
        path: ["layout", "sizing", "semantic", "iconSizeLarge"]
      }
    ]
  },

  {
    id: "radii",
    title: "Shape",
    description: "Border radius & curvature",
    tokens: [
      {
        key: "globalRadius",
        label: "Global Border Radius",
        path: ["layout", "radii", "semantic", "global"]
      }
    ]
  }
] as const;