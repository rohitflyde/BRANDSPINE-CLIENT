// src/sections/Typography/TypographyEditor.tsx
import { useEffect, useState, useCallback } from "react";
import { useBrandStore } from "../../store/brandStore";
import StyleList from "./StyleList";
import VariantTabs from "./VariantTabs";
import TypographyToolbar from "./TypographyToolbar";
import Preview from "./Preview";
import StyleNameEditor from "./StyleNameEditor";
import { createNewTypographyStyle } from "../../utils/helpers";

export default function TypographyEditor() {
  const { draft, updateDraft, saveBrand, isDirty, loading } = useBrandStore();

  // Add null checks
  if (!draft?.brand?.typography) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Typography configuration not available</p>
      </div>
    );
  }

  const typography = draft.brand.typography;
  const styles = typography.textStyles || {};
  const fontFamilies = typography.primitives?.fontFamilies || {};
  const keys = Object.keys(styles);

  const [activeStyle, setActiveStyle] = useState<string>("");
  const [variant, setVariant] = useState<"desktop" | "mobile">("desktop");
  const [previewText, setPreviewText] = useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const [editingStyle, setEditingStyle] = useState<string | null>(null);

  useEffect(() => {
    if (!activeStyle && keys.length) {
      setActiveStyle(keys[0]);
    }
  }, [keys, activeStyle]);

  const handleAddNewStyle = useCallback(() => {
    console.log("➕ Adding new typography style");
    
    // Generate new style key
    const baseKey = "newStyle";
    let counter = 1;
    let newKey = baseKey;
    while (keys.includes(newKey)) {
      newKey = `${baseKey}${counter}`;
      counter++;
    }

    // Generate label
    const baseLabel = "New Style";
    let newLabel = baseLabel;
    counter = 1;
    const existingLabels = Object.values(styles).map((s: any) => s.label);
    while (existingLabels.includes(newLabel)) {
      newLabel = `${baseLabel} ${counter}`;
      counter++;
    }

    const newStyle = createNewTypographyStyle(fontFamilies, newLabel);

    // Update the draft with new style
    updateDraft(['brand', 'typography', 'textStyles', newKey], newStyle);

    // Set as active style
    setActiveStyle(newKey);
    
    console.log("✅ New style added:", newKey, newStyle);
  }, [updateDraft, fontFamilies, styles, keys]);

  const handleEditStyle = useCallback((oldKey: string) => {
    setEditingStyle(oldKey);
  }, []);

  const handleSaveStyleName = useCallback((newKey: string, newLabel: string) => {
    if (!editingStyle) return;

    const currentStyle = styles[editingStyle];
    
    // If key changed, we need to delete the old key and add the new one
    if (editingStyle !== newKey) {
      // Create updated style with new key
      updateDraft(['brand', 'typography', 'textStyles', newKey], {
        ...currentStyle,
        label: newLabel
      });
      
      // Delete the old key
      updateDraft(['brand', 'typography', 'textStyles', editingStyle], undefined);
      
      // Update active style to new key
      setActiveStyle(newKey);
    } else {
      // Just update the label
      updateDraft(['brand', 'typography', 'textStyles', editingStyle, 'label'], newLabel);
    }

    setEditingStyle(null);
  }, [editingStyle, styles, updateDraft]);

  const handleUpdateStyle = useCallback((updates: any) => {
    if (!activeStyle) return;
    updateDraft(
      ['brand', 'typography', 'textStyles', activeStyle],
      updates
    );
  }, [activeStyle, updateDraft]);

  const handleUpdateVariant = useCallback((variantUpdates: any) => {
    if (!activeStyle) return;

    const currentStyle = styles[activeStyle];
    const updatedVariants = {
      ...currentStyle.variants,
      [variant]: {
        ...currentStyle.variants?.[variant],
        ...variantUpdates
      }
    };

    handleUpdateStyle({
      ...currentStyle,
      variants: updatedVariants
    });
  }, [activeStyle, variant, styles, handleUpdateStyle]);

  if (!activeStyle && keys.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No typography styles defined</p>
          <button
            onClick={handleAddNewStyle}
            className="px-4 py-2 bg-emerald-500 text-black rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Create First Style
          </button>
        </div>
      </div>
    );
  }

  if (!activeStyle) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Select a style to edit</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <StyleList
        styles={styles}
        active={activeStyle}
        onSelect={setActiveStyle}
        onAddNew={handleAddNewStyle}
        onEditStyle={handleEditStyle}
      />

      <div className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <VariantTabs
            value={variant}
            onChange={setVariant}
          />

          <button
            onClick={saveBrand}
            disabled={!isDirty || loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${isDirty
                ? "bg-emerald-500 text-black hover:bg-emerald-600"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <TypographyToolbar
          styleKey={activeStyle}
          variant={variant}
          previewText={previewText}
          onChangePreviewText={setPreviewText}
          onUpdateStyle={handleUpdateStyle}
          onUpdateVariant={handleUpdateVariant}
        />

        <Preview
          styleKey={activeStyle}
          variant={variant}
          text={previewText}
        />
      </div>

      {/* Style Name Editor Modal */}
      {editingStyle && (
        <StyleNameEditor
          styleKey={editingStyle}
          currentLabel={styles[editingStyle]?.label || editingStyle}
          onSave={handleSaveStyleName}
          onClose={() => setEditingStyle(null)}
          existingKeys={keys.filter(k => k !== editingStyle)}
        />
      )}
    </div>
  );
}