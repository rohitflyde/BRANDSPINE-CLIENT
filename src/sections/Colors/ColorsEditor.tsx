import { useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import SemanticEditor from "./Semantic/SemanticEditor";
import GradientsEditor from "./Gradients/GradientsEditor";

export default function ColorsEditor() {
  const { isDirty, saveBrand, loading } = useBrandStore();
  const [tab, setTab] = useState<
    "light" | "dark" | "gradients"
  >("light");

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Colors
        </h1>

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

      {/* Tabs */}
      <div className="flex gap-3">
        {[
          { id: "light", label: "Light Mode" },
          { id: "dark", label: "Dark Mode" },
          { id: "gradients", label: "Gradients" }
        ].map((t) => {
          const active = tab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 rounded-full text-sm transition
                ${
                  active
                    ? "bg-emerald-500 text-black"
                    : "bg-gray-900 text-gray-400 hover:text-gray-200"
                }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === "light" && (
        <SemanticEditor mode="light" />
      )}
      {tab === "dark" && (
        <SemanticEditor mode="dark" />
      )}
      {tab === "gradients" && <GradientsEditor />}
    </div>
  );
}
