export default function setByPath(
  source: any,
  path: (string | number)[],
  value: any
): any {
  if (!path.length) return value;

  const [key, ...rest] = path;

  return {
    ...source,
    [key]: rest.length
      ? setByPath(source?.[key] ?? {}, rest, value)
      : value
  };
}