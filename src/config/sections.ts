export const SECTIONS = [
  { id: "identity", label: "Identity", icon: "grid" },
  { id: "colors", label: "Colors", icon: "users" },
  { id: "typography", label: "Typography", icon: "pen" },
  { id: "layout", label: "Layout", icon: "pen" },
  { id: "other", label: "Other Variables", icon: "pen" },
  { id: "json", label: "JSON", icon: "pen" },
  {
  id: "preview",
  label: "Web Preview",
  icon: "🌐"
}
] as const;

export type SectionId = typeof SECTIONS[number]["id"];
