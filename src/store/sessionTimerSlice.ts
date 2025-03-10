import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { useAudioStore } from "./sessionAudioSlice";

interface TimerState {
  // État
  timeLeft: number;
  totalDuration: number;
  isRunning: boolean;
  cyclesCompleted: number;
  isLongBreak: boolean;
  showCompletionDialog: boolean;
  lastUpdateTimestamp: number; // Nouveau: timestamp de la dernière mise à jour
  startTimestamp?: number; // Nouvelle propriété pour le calcul du temps écoulé
  elapsedBeforePause: number; 
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: number) => void;
  completeCycle: () => void;
  checkTimerState: () => void; // Nouveau: vérifie l'état au montage
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timeLeft: 1500,
      totalDuration: 1500,
      isRunning: false,
      cyclesCompleted: 0,
      isLongBreak: false,
      showCompletionDialog: false,
      lastUpdateTimestamp: Date.now(),
      elapsedBeforePause: 0,

      // Démarre ou reprend le timer
      startTimer: () => {
        // Si déjà en cours, ne rien faire
        if (get().isRunning) return;
      
        const startTimestamp = Date.now();
        set({ 
          isRunning: true, 
          startTimestamp 
        });
      
        const interval = setInterval(() => {
          const { isRunning, totalDuration, startTimestamp, elapsedBeforePause } = get();
          if (!isRunning) {
            clearInterval(interval);
            return;
          }
          
          // Temps écoulé total = temps depuis le dernier démarrage + temps accumulé avant pause
          const elapsed = startTimestamp ? Math.floor((Date.now() - startTimestamp) / 1000) + elapsedBeforePause : elapsedBeforePause;
          const newTime = totalDuration - elapsed;
      
          if (newTime <= 0) {
            clearInterval(interval);
            get().completeCycle();
            set({ 
              isRunning: false,
              timeLeft: 0,
              elapsedBeforePause: 0  // Réinitialise lors de la complétion
            });
          } else {
            set({ timeLeft: newTime });
          }
        }, 1000);
      },
      
      

      // Met en pause le timer
      pauseTimer: () => {
        const { isRunning, startTimestamp, elapsedBeforePause } = get();
        if (!isRunning) return;
        
        const elapsedThisSession = startTimestamp ? Math.floor((Date.now() - startTimestamp) / 1000) : 0;
        set({ 
          isRunning: false,
          elapsedBeforePause: elapsedBeforePause + elapsedThisSession
        });
      },
      

      // Réinitialise le timer
      resetTimer: () => {
        set({
          timeLeft: get().totalDuration,
          isRunning: false,
          cyclesCompleted: 0,
          isLongBreak: false,
          showCompletionDialog: false,
          lastUpdateTimestamp: Date.now(),
          startTimestamp: 0,
          elapsedBeforePause: 0
        });
        const audioStore = useAudioStore.getState();
        audioStore.resetAudio();
        audioStore.shufflePlaylist();
      },

      // Définit une nouvelle durée
      setDuration: (duration) => {
        set({
          totalDuration: duration,
          timeLeft: duration,
          lastUpdateTimestamp: Date.now()
        });
      },

      // Complète un cycle
      completeCycle: () => {
        const { cyclesCompleted } = get();
        const isLongBreak = (cyclesCompleted + 1) % 4 === 0;

        set({
          cyclesCompleted: cyclesCompleted + 1,
          isLongBreak,
          showCompletionDialog: true,
          lastUpdateTimestamp: Date.now()
        });

        // Jouer le son de complétion
        useAudioStore.getState().playCompletionSound();
      },

      // Vérifie l'état au montage
      checkTimerState: () => {
        const { isRunning, lastUpdateTimestamp, timeLeft } = get();
        
        if (isRunning) {
          const elapsed = Math.floor((Date.now() - lastUpdateTimestamp) / 1000);
          const newTime = timeLeft - elapsed;

          if (newTime <= 0) {
            set({ 
              isRunning: false,
              timeLeft: 0,
              lastUpdateTimestamp: Date.now()
            });
            get().completeCycle();
          } else {
            set({ 
              timeLeft: newTime,
              lastUpdateTimestamp: Date.now()
            });
            get().startTimer();
          }
        }
      }
    }),
    {
      name: 'timer-storage',
      partialize: (state) => ({
        timeLeft: state.timeLeft,
        totalDuration: state.totalDuration,
        cyclesCompleted: state.cyclesCompleted,
        isLongBreak: state.isLongBreak,
        lastUpdateTimestamp: state.lastUpdateTimestamp
      })
    }
  )
);