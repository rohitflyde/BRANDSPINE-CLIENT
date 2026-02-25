import LayoutRow from "./LayoutRow";
import { breakpoints } from "./layoutConfig";

export default function LayoutTable({ group }: any) {
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-violet-500">
      <div className="bg-black/90">
        {/* Header */}
        <div className="grid grid-cols-[2fr_repeat(4,1fr)] px-4 py-3 text-sm font-medium text-white">
          <div>{group.title}</div>
          {breakpoints.map((bp) => (
            <div key={bp} className="text-center capitalize">
              {bp}
            </div>
          ))}
        </div>

        {/* Rows */}
        {group.tokens.map((token: any) => (
          <LayoutRow key={token.label} token={token} />
        ))}
      </div>
    </div>
  );
}