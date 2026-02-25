export function loadGoogleFont(
  family: string,
  weights: number[]
) {
  if (typeof document === "undefined") return;

  const id = `google-font-${family.replace(/\s+/g, "-")}`;

  // Prevent duplicate loads
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";

  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
    /\s+/g,
    "+"
  )}:wght@${weights.join(";")}&display=swap`;

  document.head.appendChild(link);
}