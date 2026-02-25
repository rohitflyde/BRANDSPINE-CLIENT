// src/sections/Json/JsonEditor.tsx
import { useEffect, useMemo, useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import JsonFilterTabs from "./JsonFilterTabs";
import { jsonModules, type JsonModule } from "./jsonPaths";

export default function JsonEditor() {
  const {
    draft,
    replaceDraftBrand,
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
      let nextBrand = parsed;

      if (module !== "all") {
        const key = jsonModules[module][0];

        nextBrand = {
          ...structuredClone(draft.brand),
          [key]: parsed[key]
        };
      }

      replaceDraftBrand(nextBrand);
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
            className="px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-300"
          >
            Apply
          </button>

          <button
            onClick={saveBrand}
            disabled={!isDirty || loading}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${
                isDirty
                  ? "bg-emerald-500 text-black"
                  : "bg-gray-800 text-gray-500"
              }`}
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Editor */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full bg-black text-white font-mono text-sm p-4 rounded-lg resize-none outline-none"
        spellCheck={false}
      />
    </div>
  );
}