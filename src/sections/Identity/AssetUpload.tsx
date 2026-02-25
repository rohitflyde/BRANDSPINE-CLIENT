type Props = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
};

export default function AssetUpload({
  label,
  value,
  onChange
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400">
        {label}
      </label>

      {value && (
        <div className="bg-gray-900 rounded-lg p-4 shadow-inner">
          <img
            src={value}
            alt={label}
            className="max-h-24"
          />
        </div>
      )}

      <input
        type="text"
        placeholder="Paste asset URL"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-900 rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
