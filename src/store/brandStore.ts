// src/store/brandStore.ts
import { create } from "zustand";
import deepMerge from "../utils/deepMerge";
import { saveBrand as saveBrandApi } from "../api/brand";

interface BrandState {
  brand: any; // The full API response { brand: {...}, config: {...} }
  draft: any; // The editable config (draft.brand will contain the config)
  isDirty: boolean;
  loading: boolean;

  /** Load brand from backend */
  setBrand: (response: { brand: any; config: any }) => void;

  /** Patch-based updates (visual editors ONLY) */
  updateDraft: (path: (string | number)[], value: any) => void;

  /** Replace brand authoritatively (JSON editor ONLY) */
  replaceDraftConfig: (config: any) => void;

  /** Persist draft config to backend */
  saveBrand: () => Promise<void>;
}

export const useBrandStore = create<BrandState>((set, get) => ({
  brand: null,
  draft: null,
  isDirty: false,
  loading: false,

  /**
   * Initialize store from API
   * The API returns { brand: {...}, config: {...} }
   * We store the full response in 'brand' and the config in 'draft'
   */
  setBrand: (response) => {
    console.log("Setting brand from response:", response);
    set({
      brand: response,
      draft: {
        brand: structuredClone(response.config) // This makes draft.brand point to the config
      },
      isDirty: false,
      loading: false
    });
  },

  /**
   * PATCH semantics
   * Used by visual editors ONLY
   * Updates the config at draft.brand
   */
  updateDraft: (path, value) =>
    set((state) => ({
      draft: deepMerge(state.draft, path, value),
      isDirty: true
    })),

  /**
   * AUTHORITATIVE replace
   * Used by JSON editor ONLY
   * Replaces the entire config
   */
  replaceDraftConfig: (config) =>
    set((state) => ({
      draft: {
        brand: structuredClone(config)
      },
      isDirty: true
    })),

  /**
   * Persist draft.brand (the config) to backend
   */
  saveBrand: async () => {
    const { draft, brand } = get();
    if (!draft?.brand) return;

    set({ loading: true });

    try {
      // Save the config to backend
      const saved = await saveBrandApi(draft.brand);
      
      // Update store with saved data
      set({
        brand: {
          ...brand,
          config: saved.config || saved // Handle different response formats
        },
        draft: {
          brand: structuredClone(saved.config || saved)
        },
        isDirty: false,
        loading: false
      });
    } catch (error) {
      console.error("Failed to save brand:", error);
      set({ loading: false });
      throw error;
    }
  }
}));