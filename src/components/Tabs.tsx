interface TabsProps {
  items: string[];
  active: string;
  onChange: (value: string) => void;
}

export default function Tabs({ items, active, onChange }: TabsProps) {
  return (
    <div className="flex gap-2 border-b">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`px-4 py-2 text-sm ${
            active === item
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
