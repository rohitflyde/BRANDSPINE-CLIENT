export async function isFontLoaded(
  family: string,
  weight = 400
): Promise<boolean> {
  if (typeof document === "undefined") return false;

  try {
    return await document.fonts.check(
      `${weight} 16px "${family}"`
    );
  } catch {
    return false;
  }
}