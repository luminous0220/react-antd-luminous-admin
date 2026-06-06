import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface GlobalStoreState {
  isMobile: boolean;
}

const initialGlobalState = {
  isMobile: false,
};

export const useGlobalStore = create<GlobalStoreState>()(
  persist(
    devtools(
      () => ({
        ...initialGlobalState,
      }),
      {
        name: "global",
      },
    ),
    {
      name: "global-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
