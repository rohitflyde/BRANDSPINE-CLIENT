import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import TypographyEditor from "../sections/Typography/TypographyEditor";
import { fetchBrand } from "../api/brand";
import { useBrandStore } from "../store/brandStore";
import type { SectionId } from "../config/sections";
import ColorsEditor from "../sections/Colors/ColorsEditor";
import IdentityEditor from "../sections/Identity/IdentityEditor";
import LayoutEditor from "../sections/Layout/LayoutEditor";
import JsonEditor from "../sections/Json/JsonEditor";
import WebPreview from "../sections/Preview/WebPreview"; // ✅ NEW

export default function Editor() {
  const { draft, setBrand } = useBrandStore();
  const [activeSection, setActiveSection] =
    useState<SectionId>("typography");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrand(import.meta.env.VITE_API_KEY)
      .then(setBrand)
      .catch(() => setError("Failed to load brand"));
  }, []);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading brand…
      </div>
    );
  }

  return (
    <AppShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === "typography" && <TypographyEditor />}
      {activeSection === "colors" && <ColorsEditor />}
      {activeSection === "layout" && <LayoutEditor />}
      {activeSection === "identity" && <IdentityEditor />}
      {activeSection === "json" && <JsonEditor />}
      {activeSection === "preview" && <WebPreview />} {/* ✅ NEW */}
    </AppShell>
  );
}