// src/store/brandStore.ts
import { create } from "zustand";
import { devtools } from 'zustand/middleware';
import deepMerge from "../utils/deepMerge";
import { saveBrand as saveBrandApi } from "../api/brand";

interface BrandState {
  brand: any;
  draft: any;
  isDirty: boolean;
  loading: boolean;
  activeBrandId: string | null;

  setBrand: (response: { brand: any; config: any }) => void;
  updateDraft: (path: (string | number)[], value: any) => void;
  replaceDraftConfig: (config: any) => void;
  saveBrand: () => Promise<void>;
  clearBrand: () => void;
  setActiveBrandId: (id: string) => void;
}

export const useBrandStore = create<BrandState>()(
  devtools(
    (set, get) => ({
      brand: null,
      draft: null,
      isDirty: false,
      loading: false,
      activeBrandId: null,

      setBrand: (response) => {
        console.log("📦 Setting brand from response:", response);
        set({
          brand: response,
          draft: {
            brand: structuredClone(response.config)
          },
          activeBrandId: response.brand.id,
          isDirty: false,
          loading: false
        });
      },

      updateDraft: (path, value) =>
        set((state) => {
          console.log("📝 Updating draft at path:", path);
          return {
            draft: deepMerge(state.draft, path, value),
            isDirty: true
          };
        }),

      replaceDraftConfig: (config) => {
        console.log("🔄 Replacing entire config");
        set((state) => ({
          draft: {
            brand: structuredClone(config)
          },
          isDirty: true
        }));
      },

      saveBrand: async () => {
        const { draft, brand } = get();
        if (!draft?.brand) {
          console.warn("⚠️ No draft brand to save");
          return;
        }

        console.log("💾 Saving brand config");
        set({ loading: true });

        try {
          const saved = await saveBrandApi(draft.brand);

          set({
            brand: {
              ...brand,
              config: saved.config || saved
            },
            draft: {
              brand: structuredClone(saved.config || saved)
            },
            isDirty: false,
            loading: false
          });

          console.log("✅ Brand saved successfully");
        } catch (error) {
          console.error("❌ Failed to save brand:", error);
          set({ loading: false });
          throw error;
        }
      },

      clearBrand: () => {
        console.log("🧹 Clearing brand store");
        set({
          brand: null,
          draft: null,
          isDirty: false,
          loading: false,
          activeBrandId: null
        });
      },

      setActiveBrandId: (id) => {
        set({ activeBrandId: id });
      }
    }),
    { name: 'BrandStore' }
  )
);