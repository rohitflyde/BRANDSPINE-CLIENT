import { useBrandStore } from "../../store/brandStore";
import { layoutGroups } from "./layoutConfig";
import LayoutTable from "./LayoutTable";

export default function LayoutEditor() {
  const { isDirty, saveBrand, loading } = useBrandStore();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Layout</h1>

        <button
          onClick={saveBrand}
          disabled={!isDirty || loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              isDirty
                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </div>

      {/* Tables */}
      {layoutGroups.map((group) => (
        <LayoutTable key={group.title} group={group} />
      ))}
    </div>
  );
}