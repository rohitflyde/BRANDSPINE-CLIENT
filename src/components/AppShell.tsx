// src/components/AppShell.tsx
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import type { SectionId } from "../config/sections";

interface AppShellProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  children: ReactNode;
}

export default function AppShell({
  activeSection,
  onSectionChange,
  children
}: AppShellProps) {
  return (
    <div
      className="flex h-screen bg-[#0f0f0f] text-white"
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale"
      }}
    >
      <Sidebar
        active={activeSection}
        onChange={onSectionChange}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}