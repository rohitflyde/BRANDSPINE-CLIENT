// src/pages/Editor.tsx
import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import TypographyEditor from "../sections/Typography/TypographyEditor";
import { fetchBrand } from "../api/brand";
import { useBrandStore } from "../store/brandStore";
import { useAuth } from "../context/AuthContext"; // Fixed import path
import type { SectionId } from "../config/sections";
import ColorsEditor from "../sections/Colors/ColorsEditor";
import IdentityEditor from "../sections/Identity/IdentityEditor";
import LayoutEditor from "../sections/Layout/LayoutEditor";
import JsonEditor from "../sections/Json/JsonEditor";
import WebPreview from "../sections/Preview/WebPreview";
import Settings from "./Settings"; // Add Settings import

export default function Editor() {
  const { brand: activeBrand, isLoading: authLoading, user, logout } = useAuth(); // Get user and logout from auth
  const { draft, setBrand, clearBrand, setActiveBrandId } = useBrandStore();
  const [activeSection, setActiveSection] = useState<SectionId>("typography");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load brand data when active brand changes
  useEffect(() => {
    const loadBrand = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Clear old brand data
        clearBrand();

        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // Fetch brand data using JWT
        const response = await fetchBrand();
        console.log("📦 Brand data loaded:", response);
        
        // Set the brand in store
        setBrand(response);
        setActiveBrandId(response.brand.id);
      } catch (err: any) {
        console.error('❌ Failed to load brand:', err);
        setError(err.message || "Failed to load brand");

        if (err.message?.includes('Session expired') || err.message?.includes('No authentication token')) {
          logout(); // Use logout from auth context
        }
      } finally {
        setLoading(false);
      }
    };

    if (activeBrand) {
      loadBrand();
    }
  }, [activeBrand?.brand?.id, clearBrand, setBrand, setActiveBrandId, logout]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your brand...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-100/10 p-6 rounded-lg">
          <p className="text-xl mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if draft and draft.brand exist
  if (!draft || !draft.brand) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-xl mb-2">No brand data available</p>
          <p className="text-sm text-gray-500">Please create a brand first</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      userEmail={user?.email} // Pass user email from auth context
      onLogout={logout} // Pass logout function from auth context
    >
      {activeSection === "typography" && <TypographyEditor key={draft.brand.meta?.name} />}
      {activeSection === "colors" && <ColorsEditor key={draft.brand.meta?.name} />}
      {activeSection === "layout" && <LayoutEditor key={draft.brand.meta?.name} />}
      {activeSection === "identity" && <IdentityEditor key={draft.brand.meta?.name} />}
      {activeSection === "json" && <JsonEditor key={draft.brand.meta?.name} />}
      {activeSection === "preview" && <WebPreview key={draft.brand.meta?.name} />}
      {activeSection === "settings" && <Settings key={draft.brand.meta?.name} />}
    </AppShell>
  );
}