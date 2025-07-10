import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PrefUserState {
  tasklist_DisplayFinishedTasks: boolean;
  tasklist_DisplayDetailsTasks: boolean;
  matrice_DisplayFinishedTasks: boolean;
  calendar_DisplayFinishedTasks: boolean;
  calendar_ViewMode: "mois" | "semaine" | "jour";
  notification_Subscribed: boolean;
  setNotificationSubscribed: (value: boolean) => void;
  setCalendarViewMode: (viewMode: "mois" | "semaine" | "jour") => void;
  setCalendarDisplayFinishedTasks: (value: boolean) => void;
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
      calendar_DisplayFinishedTasks: true,
      notification_Subscribed: false,
      calendar_ViewMode: "mois",

      setNotificationSubscribed: (value: boolean) => set({ notification_Subscribed: !value }),
      setCalendarViewMode: (viewMode: "mois" | "semaine" | "jour") => set({ calendar_ViewMode: viewMode }),
      setCalendarDisplayFinishedTasks: (value: boolean) => set({ calendar_DisplayFinishedTasks: !value }),
      setTasklistDisplayFinishedTasks: (value: boolean) => set({ tasklist_DisplayFinishedTasks: !value }),
      setMatriceDisplayFinishedTasks: (value: boolean) => set({ matrice_DisplayFinishedTasks: !value }),
      setTasklistDisplayDetailsTasks: (value: boolean) => set({ tasklist_DisplayDetailsTasks: !value }),
    }),
    {
      name: "pref-user",
    }
  )
);

