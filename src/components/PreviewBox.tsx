import type { ReactNode } from "react";


export default function PreviewBox({
  children,
  style
}: {
  children: ReactNode;
  style: React.CSSProperties;
}) {
  return (
    <div className="border rounded p-6 bg-white">
      <div style={style}>{children}</div>
    </div>
  );
}
