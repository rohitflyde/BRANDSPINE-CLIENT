import { useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import LogosEditor from "./Logos/LogosEditor";
import FaviconEditor from "./Favicon/FaviconEditor";
import LoaderEditor from "./Loader/LoaderEditor";
import AppIconEditor from "./AppIcon/AppIconEditor";

export default function IdentityEditor() {
  const { isDirty, saveBrand, loading } = useBrandStore();
  const [tab, setTab] = useState<
    "logos" | "favicon" | "appIcon" | "loader"
  >("logos");

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Identity
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
          { id: "logos", label: "Logos" },
          { id: "favicon", label: "Favicon" },
          { id: "appIcon", label: "App Icon" },
          { id: "loader", label: "Loader" }
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
      {tab === "logos" && <LogosEditor />}
      {tab === "favicon" && <FaviconEditor />}
      {tab === "appIcon" && <AppIconEditor />}
      {tab === "loader" && <LoaderEditor />}
    </div>
  );
}
