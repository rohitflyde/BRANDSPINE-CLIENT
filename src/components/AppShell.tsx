// components/AppShell.tsx
import React, { useState } from "react";
import type { SectionId } from "../config/sections";
import { useBrandStore } from "../store/brandStore";
import {
  Type,
  Palette,
  Layout as LayoutIcon,
  Fingerprint,
  FileJson,
  Eye,
  LogOut,
  Download,
  User,
  ChevronDown,
  Settings,
  Layout
} from "lucide-react";
import BrandSwitcher from "./BrandSwitcher";

interface AppShellProps {
  children: React.ReactNode;
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  userEmail?: string;
  onLogout?: () => void;
}


const sections: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: "typography", label: "Typography", icon: <Type size={20} /> },
  { id: "colors", label: "Colors", icon: <Palette size={20} /> },
  { id: "layout", label: "Layout", icon: <Layout size={20} /> },
  { id: "identity", label: "Identity", icon: <Fingerprint size={20} /> },
  { id: "json", label: "JSON", icon: <FileJson size={20} /> },
  { id: "preview", label: "Preview", icon: <Eye size={20} /> },
  { id: "settings", label: "Settings", icon: <Settings size={20} /> }, // Add this
];
export default function AppShell({
  children,
  activeSection,
  onSectionChange,
  userEmail,
  onLogout
}: AppShellProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { draft } = useBrandStore();

  // Get logo from brand config - try multiple possible paths
  const logo = draft?.brand?.identity?.logos?.primary ||
    draft?.brand?.identity?.logo?.light?.primary ||
    null;

  // Generate CSS from brand config
  const generateCSS = () => {
    if (!draft?.brand) return '';

    const { colors, typography, layout } = draft.brand;
    let css = `/* Brand CSS Variables */
:root {\n`;

    // Color primitives
    if (colors?.primitives?.palette) {
      css += '\n  /* Color Palette */\n';
      Object.entries(colors.primitives.palette).forEach(([key, value]) => {
        css += `  --color-${key}: ${value};\n`;
      });
    }

    // Color gradients
    if (colors?.primitives?.gradients) {
      css += '\n  /* Gradients */\n';
      Object.entries(colors.primitives.gradients).forEach(([key, gradient]) => {
        if (gradient.type === 'linear') {
          const stops = gradient.stops.map((stop: any) =>
            `var(--color-${stop.color}) ${stop.position}%`
          ).join(', ');
          css += `  --gradient-${key}: linear-gradient(${gradient.angle}deg, ${stops});\n`;
        }
      });
    }

    // Light mode semantic colors
    if (colors?.modes?.light?.semantic) {
      css += '\n  /* Light Mode */\n';
      Object.entries(colors.modes.light.semantic).forEach(([key, value]) => {
        css += `  --${key}: var(--color-${value});\n`;
      });
    }

    // Dark mode semantic colors
    if (colors?.modes?.dark?.semantic) {
      css += '\n  /* Dark Mode */\n';
      css += '  @media (prefers-color-scheme: dark) {\n';
      Object.entries(colors.modes.dark.semantic).forEach(([key, value]) => {
        css += `    --${key}: var(--color-${value});\n`;
      });
      css += '  }\n';
    }

    // Typography - Font Families
    if (typography?.primitives?.fontFamilies) {
      css += '\n  /* Font Families */\n';
      Object.entries(typography.primitives.fontFamilies).forEach(([key, value]) => {
        const fallback = value.fallback?.join(', ') || 'sans-serif';
        css += `  --font-${key}: ${value.family}, ${fallback};\n`;
      });
    }

    // Text Styles
    if (typography?.textStyles) {
      css += '\n  /* Text Styles */\n';
      Object.entries(typography.textStyles).forEach(([key, style]) => {
        if (style.variants?.desktop) {
          const v = style.variants.desktop;
          css += `  --${key}-font-family: var(--font-${v.fontFamily});\n`;
          css += `  --${key}-font-size: ${v.fontSize}px;\n`;
          css += `  --${key}-line-height: ${v.lineHeight}px;\n`;
          css += `  --${key}-font-weight: ${v.fontWeight};\n`;
          if (v.letterSpacing) css += `  --${key}-letter-spacing: ${v.letterSpacing}px;\n`;
          if (v.case) css += `  --${key}-text-transform: ${v.case};\n`;
          if (v.decoration) css += `  --${key}-text-decoration: ${v.decoration};\n`;
        }
      });
    }

    // Spacing
    if (layout?.spacing?.scale) {
      css += '\n  /* Spacing Scale */\n';
      Object.entries(layout.spacing.scale).forEach(([key, value]) => {
        css += `  --spacing-${key}: ${value}px;\n`;
      });
    }

    // Semantic Spacing
    if (layout?.spacing?.semantic) {
      css += '\n  /* Semantic Spacing */\n';
      Object.entries(layout.spacing.semantic).forEach(([key, value]) => {
        if (typeof value === 'string') {
          css += `  --${key}: var(--spacing-${value});\n`;
        } else if (typeof value === 'number') {
          css += `  --${key}: ${value}px;\n`;
        }
      });
    }

    // Border Radius
    if (layout?.radii?.scale) {
      css += '\n  /* Border Radius */\n';
      Object.entries(layout.radii.scale).forEach(([key, value]) => {
        css += `  --radius-${key}: ${value}px;\n`;
      });
    }

    // Semantic Border Radius
    if (layout?.radii?.semantic) {
      css += '\n  /* Semantic Border Radius */\n';
      Object.entries(layout.radii.semantic).forEach(([key, value]) => {
        if (typeof value === 'string') {
          css += `  --radius-${key}: var(--radius-${value});\n`;
        } else if (typeof value === 'number') {
          css += `  --radius-${key}: ${value}px;\n`;
        }
      });
    }

    css += '}\n';
    return css;
  };

  // Download CSS file
  const downloadCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-variables.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Logo Area */}
        <div className="p-2 border-b border-gray-700">
          {/* {logo ? (
            <img
              src={'https://ik.imagekit.io/p1zreiw3z/Brandspine/BRANDSPINE.png'}
              alt="Brand Logo"
              className="max-h-10 w-auto object-contain"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">B</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Brand Builder</h2>
                <p className="text-xs text-gray-400">Multi-tenant CMS</p>
              </div>
            </div>
          )} */}

          <BrandSwitcher />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeSection === section.id
                ? "bg-emerald-900 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
            >
              <span className="text-gray-400">{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </nav>

        {/* Download CSS Button */}
        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={downloadCSS}
            className="w-full flex cursor-pointer items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-purple-600 text-white rounded-lg hover:from-green-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Download CSS</span>
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            CSS variables for your brand
          </p>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userEmail || 'User'}
                </p>
                <p className="text-xs text-gray-400">Tenant Admin</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-700 flex-shrink-0"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Simple Header with just the section title */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">
                {sections.find(s => s.id === activeSection)?.label || 'Editor'}
              </h1>
              {/* Add Brand Switcher here */}
              {/* <div className="w-64">
                <BrandSwitcher />
              </div> */}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}