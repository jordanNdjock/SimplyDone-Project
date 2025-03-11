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
  isWorkSession: boolean;       // true : session de travail, false : pause
  showCompletionDialog: boolean;
  lastUpdateTimestamp: number;  // Timestamp de la dernière mise à jour
  startTimestamp?: number;      // Pour le calcul du temps écoulé
  elapsedBeforePause: number; 
  closeDialog: () => void;
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: number) => void;
  completeCycle: () => void;
  checkTimerState: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      timeLeft: 1500,
      totalDuration: 1500,
      isRunning: false,
      cyclesCompleted: 0,
      isLongBreak: false,
      isWorkSession: true, // On commence par une session de travail
      showCompletionDialog: false,
      lastUpdateTimestamp: Date.now(),
      elapsedBeforePause: 0,

      // Démarre ou reprend le timer
      startTimer: () => {
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
          const elapsed = startTimestamp
            ? Math.floor((Date.now() - startTimestamp) / 1000) + elapsedBeforePause
            : elapsedBeforePause;
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
      
      // Réinitialise le timer et relance l'audio
      resetTimer: () => {
        set({
          timeLeft: get().totalDuration,
          isRunning: false,
          cyclesCompleted: 0,
          isLongBreak: false,
          isWorkSession: true,
          showCompletionDialog: false,
          lastUpdateTimestamp: Date.now(),
          startTimestamp: 0,
          elapsedBeforePause: 0
        });
        const audioStore = useAudioStore.getState();
        audioStore.resetAudio();
        audioStore.shufflePlaylist();
      },
      
      // Définit une nouvelle durée pour la session courante
      setDuration: (duration) => {
        set({
          totalDuration: duration,
          timeLeft: duration,
          lastUpdateTimestamp: Date.now(),
          startTimestamp: 0,
          elapsedBeforePause: 0,
        });
      },
      
      // Complète un cycle et bascule le type de session
      completeCycle: () => {
        const { isWorkSession, cyclesCompleted } = get();
        set({
          showCompletionDialog: true,
          lastUpdateTimestamp: Date.now(),
          startTimestamp: 0,
          elapsedBeforePause: 0
        });
        if (isWorkSession) {
          // Fin d'une session de travail : passage en pause
          set({ isWorkSession: false });
        } else {
          // Fin d'une pause : incrémenter le compteur et repasser en session de travail
          set({
            isWorkSession: true,
            cyclesCompleted: cyclesCompleted + 1,
          });
        }
        // Jouer le son de complétion
        useAudioStore.getState().playCompletionSound();
        const audioStore = useAudioStore.getState();
        audioStore.resetAudio();
        audioStore.shufflePlaylist();
      },

      closeDialog: () => {
        set({ showCompletionDialog: false });
      },
      
      // Vérifie l'état du timer au montage
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
        lastUpdateTimestamp: state.lastUpdateTimestamp,
        startTimestamp: state.startTimestamp,
        elapsedBeforePause: state.elapsedBeforePause,
        isWorkSession: state.isWorkSession,
      })
    }
  )
);
