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
  resetCurrentCycle: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: number) => void;
  completeCycle: (cycles_before_long_break?: number) => void;
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
        const currentElapsed = get().totalDuration - get().timeLeft;
        set({ 
          isRunning: true, 
          startTimestamp,
          lastUpdateTimestamp: startTimestamp,
          elapsedBeforePause: currentElapsed
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
      
      resetCurrentCycle: () => {
        set({
          timeLeft: get().totalDuration,
          isRunning: false,
          lastUpdateTimestamp: Date.now(),
          startTimestamp: 0,
          elapsedBeforePause: 0,
          showCompletionDialog: false,
        });
        const audioStore = useAudioStore.getState();
        audioStore.resetAudio();
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
      completeCycle: (cycles_before_long_break?: number) => {
        const { isWorkSession, cyclesCompleted, isLongBreak } = get();
        
        // Affiche la modal pour signaler la fin de la session courante
        set({
          showCompletionDialog: true,
          lastUpdateTimestamp: Date.now(),
          startTimestamp: 0,
          elapsedBeforePause: 0,
        });
        // Utilise la valeur passée en paramètre ou 4 par défaut
        const cyclesBeforeLongBreak = cycles_before_long_break !== undefined ? cycles_before_long_break : 4;
        
        if (isWorkSession) {
          // Fin d'une session de travail : passage en mode pause
          set({ isWorkSession: false });
        } else {
          // Fin d'une pause : on vérifie si le prochain cycle correspond à la longue pause
          if ((cyclesCompleted + 1) === cyclesBeforeLongBreak) {
            if(isLongBreak){
              // Après la longue pause, on réinitialise le compteur de cycles
              set({ isWorkSession: true, cyclesCompleted: 0, isLongBreak: false });
            } else {
              // Sinon, on marque la pause longue
              set({ isLongBreak: true });
            }
          } else {
            // Sinon, on incrémente le compteur et on repasse en session de travail
            set({ isWorkSession: true, cyclesCompleted: cyclesCompleted + 1 });
          }
        }
        
        // Jouer le son de complétion et réinitialiser l'audio
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
