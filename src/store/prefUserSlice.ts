import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PrefUserState {
  tasklist_DisplayFinishedTasks: boolean;
  tasklist_DisplayDetailsTasks: boolean;
  matrice_DisplayFinishedTasks: boolean;
  setTasklistDisplayFinishedTasks: (value: boolean) => void;
  setMatriceDisplayFinishedTasks: (value: boolean) => void;
  setTasklistDisplayDetailsTasks: (value: boolean) => void;
}

export const usePrefUserStore = create<PrefUserState>()(
  persist(
    (set) => ({
      tasklist_DisplayFinishedTasks: true,
      matrice_DisplayFinishedTasks: true,
      tasklist_DisplayDetailsTasks: true,

      setTasklistDisplayFinishedTasks: (value: boolean) => set({ tasklist_DisplayFinishedTasks: !value }),
      setMatriceDisplayFinishedTasks: (value: boolean) => set({ matrice_DisplayFinishedTasks: !value }),
      setTasklistDisplayDetailsTasks: (value: boolean) => set({ tasklist_DisplayDetailsTasks: !value }),
    }),
    {
      name: "pref-user",
    }
  )
);

