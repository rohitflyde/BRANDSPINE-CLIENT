// Editor.tsx
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
import WebPreview from "../sections/Preview/WebPreview";
import Settings from "./Settings";

// Logout function
const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export default function Editor() {
  const { draft, setBrand } = useBrandStore();
  const [activeSection, setActiveSection] = useState<SectionId>("typography");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const loadBrand = async () => {
      try {
        setLoading(true);

        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Decode token to get user email (optional)
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserEmail(payload.email || "User");
        } catch (e) {
          console.error("Failed to decode token:", e);
        }

        // Fetch brand data using JWT
        const response = await fetchBrand();
        console.log("Brand data loaded:", response);

        // Set the brand in store - response should be { brand: {...}, config: {...} }
        setBrand(response);
      } catch (err: any) {
        console.error('Failed to load brand:', err);
        setError(err.message || "Failed to load brand");

        // If unauthorized, redirect to login
        if (err.message?.includes('Session expired') || err.message?.includes('No authentication token')) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadBrand();
  }, [setBrand]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your brand...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-100/10 p-6 rounded-lg">
          <p className="text-xl mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Check if draft and draft.brand exist
  if (!draft || !draft.brand) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        No brand data available
      </div>
    );
  }

  return (
    <AppShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      // Pass user info and logout to AppShell if needed
      userEmail={userEmail}
      onLogout={handleLogout}
    >
      {activeSection === "typography" && <TypographyEditor />}
      {activeSection === "colors" && <ColorsEditor />}
      {activeSection === "layout" && <LayoutEditor />}
      {activeSection === "identity" && <IdentityEditor />}
      {activeSection === "json" && <JsonEditor />}
      {activeSection === "preview" && <WebPreview />}
      {activeSection === "settings" && <Settings />}
    </AppShell>
  );
}