export default function InheritBadge({
  source
}: {
  source: "desktop" | "tablet" | null;
}) {
  if (!source) return null;

  return (
    <span className="
      ml-2 px-2 py-0.5
      text-[10px] uppercase tracking-wide
      rounded-full
      bg-gray-800 text-gray-400
    ">
      Inherited · {source}
    </span>
  );
}
