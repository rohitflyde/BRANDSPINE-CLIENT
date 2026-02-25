// src/sections/Preview/blocks/ButtonPreviewBlock.tsx

type Props = {
  variant: "desktop" | "mobile";
  background: string;
  textColor: string;
};

export default function ButtonPreviewBlock({
  background,
  textColor
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold">
        Buttons
      </h2>

      <div className="flex gap-4 flex-wrap">
        {/* Primary */}
        <button
          style={{
            backgroundColor: background,
            color: textColor,
            padding: "12px 24px",
            borderRadius: 8
          }}
        >
          Primary Button
        </button>

        {/* Secondary */}
        <button
          style={{
            backgroundColor: "transparent",
            color: background,
            border: `1px solid ${background}`,
            padding: "12px 24px",
            borderRadius: 8
          }}
        >
          Secondary Button
        </button>
      </div>
    </section>
  );
}