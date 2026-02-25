// src/store/brandStore.ts
import { create } from "zustand";
import deepMerge from "../utils/deepMerge";
import { saveBrand as saveBrandApi } from "../api/brand";

interface BrandState {
  brand: any;
  draft: any;
  isDirty: boolean;
  loading: boolean;

  /** Load brand from backend */
  setBrand: (brand: any) => void;

  /** Patch-based updates (visual editors ONLY) */
  updateDraft: (path: (string | number)[], value: any) => void;

  /** Replace brand authoritatively (JSON editor ONLY) */
  replaceDraftBrand: (brand: any) => void;

  /** Persist draft.brand to backend */
  saveBrand: () => Promise<void>;
}

export const useBrandStore = create<BrandState>((set, get) => ({
  brand: null,
  draft: null,
  isDirty: false,
  loading: false,

  /**
   * Initialize store from API
   * Always clone → draft
   */
  setBrand: (brand) =>
    set({
      brand,
      draft: structuredClone(brand),
      isDirty: false,
      loading: false
    }),

  /**
   * PATCH semantics
   * Used by visual editors ONLY
   */
  updateDraft: (path, value) =>
    set((state) => ({
      draft: deepMerge(state.draft, path, value),
      isDirty: true
    })),

  /**
   * AUTHORITATIVE replace
   * Used by JSON editor ONLY
   */
  replaceDraftBrand: (brand) =>
    set((state) => ({
      draft: {
        ...state.draft,
        brand: structuredClone(brand)
      },
      isDirty: true
    })),

  /**
   * Persist draft.brand → backend
   */
  saveBrand: async () => {
    const { draft } = get();
    if (!draft?.brand) return;

    set({ loading: true });

    const saved = await saveBrandApi(
      import.meta.env.VITE_API_KEY,
      draft.brand
    );

    set({
      brand: saved,
      draft: structuredClone(saved),
      isDirty: false,
      loading: false
    });
  }
}));