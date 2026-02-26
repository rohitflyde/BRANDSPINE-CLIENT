// src/sections/Colors/SemanticColorGrid.tsx
import { useState } from "react";
import { useBrandStore } from "../../store/brandStore";
import ColorSwatch from "./ColorSwatch";
import ColorPickerPanel from "./ColorPickerPanel";
import { Plus } from 'lucide-react';

type Props = {
  mode: "light" | "dark";
};

// Default groups - these will be merged with custom groups
const DEFAULT_GROUPS: Record<string, string[]> = {
  Primary: ["primary", "primaryHover"],
  Surface: ["background", "surface", "border"],
  Text: ["textPrimary", "textSecondary"]
};

export default function SemanticColorGrid({ mode }: Props) {
  const { draft, updateDraft } = useBrandStore();
  const [activeColor, setActiveColor] = useState<{
    semanticKey: string;
  } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newColorKey, setNewColorKey] = useState("");
  const [newColorLabel, setNewColorLabel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewColorInput, setShowNewColorInput] = useState(false);

  if (
    !draft?.brand?.colors?.modes?.[mode]?.semantic ||
    !draft?.brand?.colors?.primitives?.palette
  ) {
    return (
      <div className="text-sm text-gray-500">
        No semantic colors defined for {mode} mode.
      </div>
    );
  }

  const semantic = draft.brand.colors.modes[mode].semantic;
  const palette = draft.brand.colors.primitives.palette;

  // Get custom groups from the config (you can store this in a separate field)
  const customGroups = draft.brand.colors.modes[mode].groups || {};
  const allGroups = { ...DEFAULT_GROUPS, ...customGroups };

  // Get all used semantic keys
  const allSemanticKeys = Object.keys(semantic);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const categoryKey = newCategoryName.toLowerCase().replace(/\s+/g, '_');

    // Update the groups
    updateDraft(
      ['brand', 'colors', 'modes', mode, 'groups', categoryKey],
      []
    );

    setNewCategoryName("");
    setShowNewCategoryInput(false);
    setSelectedCategory(categoryKey);
  };

  const handleAddColor = () => {
    if (!newColorKey.trim() || !newColorLabel.trim() || !selectedCategory) return;

    const colorKey = newColorKey.toLowerCase().replace(/\s+/g, '_');

    // Add the new semantic color with default value (using first palette color)
    const firstPaletteKey = Object.keys(palette)[0] || '#000000';

    updateDraft(
      ['brand', 'colors', 'modes', mode, 'semantic', colorKey],
      firstPaletteKey
    );

    // Add to category
    const categoryColors = allGroups[selectedCategory] || [];
    updateDraft(
      ['brand', 'colors', 'modes', mode, 'groups', selectedCategory],
      [...categoryColors, colorKey]
    );

    setNewColorKey("");
    setNewColorLabel("");
    setShowNewColorInput(false);
  };

  const handleDeleteColor = (semanticKey: string, categoryKey: string) => {
    // Remove from semantic colors
    updateDraft(
      ['brand', 'colors', 'modes', mode, 'semantic', semanticKey],
      undefined
    );

    // Remove from category
    const categoryColors = allGroups[categoryKey].filter(k => k !== semanticKey);
    updateDraft(
      ['brand', 'colors', 'modes', mode, 'groups', categoryKey],
      categoryColors
    );
  };

  const handleDeleteCategory = (categoryKey: string) => {
    // Delete all colors in this category
    const colorsToDelete = allGroups[categoryKey] || [];
    colorsToDelete.forEach(colorKey => {
      updateDraft(
        ['brand', 'colors', 'modes', mode, 'semantic', colorKey],
        undefined
      );
    });

    // Delete the category
    updateDraft(
      ['brand', 'colors', 'modes', mode, 'groups', categoryKey],
      undefined
    );
  };

  return (
    <div className="flex gap-12">
      {/* LEFT: Color grid */}
      <div className="flex-1 space-y-10">
        {Object.entries(allGroups).map(([groupKey, keys]) => (
          <div key={groupKey} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium capitalize">
                {groupKey.replace(/_/g, ' ')}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedCategory(groupKey);
                    setShowNewColorInput(true);
                  }}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
                  title="Add new color"
                >
                  <Plus size={16} />
                </button>
                {!Object.keys(DEFAULT_GROUPS).includes(groupKey) && (
                  <button
                    onClick={() => handleDeleteCategory(groupKey)}
                    className="p-1.5 bg-gray-800 hover:bg-red-600 rounded-full text-gray-400 hover:text-white transition-colors"
                    title="Delete category"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              {keys.map((semanticKey) => {
                const token = semantic[semanticKey];
                const hex = palette[token] ?? token;
                const label = semanticKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                return (
                  <ColorSwatch
                    key={semanticKey}
                    label={label}
                    token={token}
                    hex={hex}
                    semanticKey={semanticKey}
                    mode={mode}
                    onEdit={() => setActiveColor({ semanticKey })}
                    onDelete={() => handleDeleteColor(semanticKey, groupKey)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Add New Category Button */}
        {/* <div className="pt-4">
          {showNewCategoryInput ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name (e.g., Status, Feedback)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-3"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNewCategoryInput(false)}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="px-3 py-1.5 text-sm bg-emerald-500 text-black rounded hover:bg-emerald-600 disabled:opacity-50"
                >
                  Add Category
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowNewCategoryInput(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors border border-gray-700"
            >
              <Plus size={18} />
              <span>Add New Category</span>
            </button>
          )}
        </div> */}

        {/* New Color Input */}
        {showNewColorInput && selectedCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add New Color</h3>
              <h4 className="text-sm text-gray-400 mb-4">
                to {selectedCategory.replace(/_/g, ' ')} category
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Color Key <span className="text-xs text-gray-500">(used in code)</span>
                  </label>
                  <input
                    type="text"
                    value={newColorKey}
                    onChange={(e) => setNewColorKey(e.target.value)}
                    placeholder="e.g., success, warning, error"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Display Label
                  </label>
                  <input
                    type="text"
                    value={newColorLabel}
                    onChange={(e) => setNewColorLabel(e.target.value)}
                    placeholder="e.g., Success, Warning, Error"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <p className="text-xs text-blue-400">
                    The color will be initialized with the first available palette color. You can change it using the color picker.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowNewColorInput(false);
                      setNewColorKey("");
                      setNewColorLabel("");
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddColor}
                    disabled={!newColorKey.trim() || !newColorLabel.trim()}
                    className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                  >
                    Add Color
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Color picker panel */}
      {activeColor && (
        <ColorPickerPanel
          mode={mode}
          semanticKey={activeColor.semanticKey}
          onClose={() => setActiveColor(null)}
        />
      )}
    </div>
  );
}