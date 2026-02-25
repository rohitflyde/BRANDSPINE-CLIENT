type Props = {
  label: string;
  token: string;
  hex: string;
  semanticKey: string;
  mode: "light" | "dark";
  onEdit: () => void;
};

export default function ColorSwatch({
  label,
  token,
  hex,
  onEdit
}: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-24 h-24 rounded-full border border-white/10"
        style={{ backgroundColor: hex }}
      />

      <div className="text-xs text-gray-400">{label}</div>

      <div className="text-[10px] text-gray-500">
        {token}
      </div>

      <button
        onClick={onEdit}
        className="px-3 py-1 text-xs rounded-full bg-violet-500 text-white"
      >
        Edit
      </button>
    </div>
  );
}
