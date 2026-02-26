// src/sections/Json/JsonEditor.tsx
import { useEffect, useMemo, useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import JsonFilterTabs from "./JsonFilterTabs";
import { jsonModules, type JsonModule } from "./jsonPaths";

export default function JsonEditor() {
  const {
    draft,
    replaceDraftConfig, // ✅ FIXED: Use correct function name
    saveBrand,
    isDirty,
    loading
  } = useBrandStore();

  const [module, setModule] = useState<JsonModule>("all");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  /**
   * What we SHOW in the editor
   * This is a VIEW, not what we APPLY
   */
  const visibleJson = useMemo(() => {
    if (!draft?.brand) return {};

    if (module === "all") {
      return draft.brand;
    }

    const key = jsonModules[module][0];
    return {
      [key]: draft.brand[key]
    };
  }, [draft, module]);

  /**
   * Sync editor when module or draft changes
   * IMPORTANT: this does NOT mutate state
   */
  useEffect(() => {
    setText(JSON.stringify(visibleJson, null, 2));
    setError(null);
  }, [visibleJson]);

  /**
   * APPLY = AUTHORITATIVE REPLACE
   */
  function applyChanges() {
    try {
      const parsed = JSON.parse(text);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("JSON must be an object");
      }

      /**
       * If user is NOT in "all",
       * we reconstruct full brand safely
       */
      let nextConfig = parsed;

      if (module !== "all") {
        const key = jsonModules[module][0];

        nextConfig = {
          ...structuredClone(draft.brand),
          [key]: parsed[key]
        };
      }

      // ✅ FIXED: Call replaceDraftConfig with the new config
      replaceDraftConfig(nextConfig);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Invalid JSON");
    }
  }

  return (
    <div className="p-8 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <JsonFilterTabs active={module} onChange={setModule} />

        <div className="flex gap-3">
          <button
            onClick={applyChanges}
            className="px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Apply
          </button>

          <button
            onClick={saveBrand}
            disabled={!isDirty || loading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                isDirty
                  ? "bg-emerald-500 text-black hover:bg-emerald-600"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Editor */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full bg-gray-900 text-white font-mono text-sm p-4 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-500"
        spellCheck={false}
      />
    </div>
  );
}