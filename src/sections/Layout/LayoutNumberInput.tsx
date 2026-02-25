type Props = {
  value: number;
  onChange: (v: number) => void;
};

export default function LayoutNumberInput({ value, onChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(value - 1)}
        className="w-8 h-8 rounded-md bg-black text-white hover:bg-gray-900"
      >
        −
      </button>

      <div className="w-10 text-center text-sm text-white">
        {value}
      </div>

      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-md bg-black text-white hover:bg-gray-900"
      >
        +
      </button>
    </div>
  );
}