import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { shuffleArray } from '@/src/lib/utils';
import { useTimerStore } from "./sessionTimerSlice";

interface AudioState {
  // État
  soundEnabled: boolean;
  soundVolume: number;
  isPlaying: boolean;
  currentTrackIndex: number;
  playbackProgress: number; // Position de lecture actuelle
  shuffledPlaylist: string[];
  audioElement: HTMLAudioElement | null;

  // Actions
  initializeAudio: () => void;
  togglePlayback: () => void;
  playNextTrack: () => void;
  resetAudio: () => void;
  playCompletionSound: () => void;
  toggleSound: () => void;
  updateVolume: (volume: number) => void;
  shufflePlaylist: () => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      soundVolume: 0.5,
      isPlaying: false,
      currentTrackIndex: -1,
      playbackProgress: 0,
      shuffledPlaylist: [],
      audioElement: null,

      // Initialisation de l'élément audio
      initializeAudio: () => {
        if (typeof window === 'undefined' || get().audioElement) return;
      
        const audio = new Audio();
        audio.preload = "auto"; // Permet de charger l'audio à l'avance
        // Optionnel : appeler load() pour forcer le préchargement
        audio.load();
      
        audio.addEventListener('timeupdate', () => {
          set({ playbackProgress: audio.currentTime });
        });

        audio.addEventListener("pause", () => {
          useTimerStore.getState().pauseTimer();
        });
      
        audio.addEventListener("play", () => {
          useTimerStore.getState().startTimer();
        });
      
      
        audio.addEventListener('ended', () => {
          get().playNextTrack();
        });
      
        set({ audioElement: audio });
      },      

      // Lecture/Pause
      togglePlayback: () => {
        const { audioElement, isPlaying, shuffledPlaylist, currentTrackIndex } = get();
        if (!audioElement) return;

        if (isPlaying) {
          audioElement.pause();
          set({ isPlaying: false });
        } else {
          if (shuffledPlaylist.length === 0) get().shufflePlaylist();
          
          const trackIndex = currentTrackIndex === -1 ? 0 : currentTrackIndex;
          audioElement.src = get().shuffledPlaylist[trackIndex];
          audioElement.currentTime = get().playbackProgress;
          audioElement.play()
            .then(() => set({ isPlaying: true, currentTrackIndex: trackIndex }))
            .catch(e => console.error("Erreur lecture audio:", e));
        }
      },

      // Passage au son suivant
      playNextTrack: () => {
        const { audioElement, shuffledPlaylist, soundVolume, soundEnabled } = get();
        if (!audioElement || !soundEnabled) return;

        const nextIndex = (get().currentTrackIndex + 1) % shuffledPlaylist.length;
        audioElement.src = shuffledPlaylist[nextIndex];
        audioElement.currentTime = 0;
        audioElement.volume = soundVolume;
        
        set({ 
          currentTrackIndex: nextIndex,
          playbackProgress: 0
        });

        audioElement.play();
      },

      // Réinitialisation
      resetAudio: () => {
        const audio = get().audioElement;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        set({ 
          currentTrackIndex: -1,
          playbackProgress: 0,
          isPlaying: false 
        });
      },

      // Son de complétion
      playCompletionSound: () => {
        const completionAudio = new Audio('/assets/sounds/complete.mp3');
        completionAudio.volume = get().soundVolume;
        completionAudio.play().catch(e => console.error("Erreur son de complétion:", e));
        if ("vibrate" in navigator) {
          navigator.vibrate([100, 50, 100, 50, 100]);
        }
      },

      // Activation/Désactivation du son
      toggleSound: () => {
        set((state) => {
          const newState = !state.soundEnabled;
          if (state.audioElement) {
            state.audioElement.muted = !newState;
          }
          return { soundEnabled: newState };
        });
      },

      // Mise à jour du volume
      updateVolume: (volume) => {
        const newVolume = Math.min(1, Math.max(0, volume));
        set({ soundVolume: newVolume });
        const audio = get().audioElement;
        if (audio) audio.volume = newVolume;
      },

      // Shuffle de la playlist
      shufflePlaylist: () => {
        const ambientSounds = [
          '/assets/sounds/relax-1.mp3',
          '/assets/sounds/relax-2.mp3',
          '/assets/sounds/relax-3.mp3',
          '/assets/sounds/relax-4.mp3',
          '/assets/sounds/relax-5.mp3',
          '/assets/sounds/relax-6.mp3',
          '/assets/sounds/relax-7.mp3',
          '/assets/sounds/relax-8.mp3',
          '/assets/sounds/relax-9.mp3',
          '/assets/sounds/relax-10.mp3',
          '/assets/sounds/relax-11.mp3',
          '/assets/sounds/relax-12.mp3',
          '/assets/sounds/relax-13.mp3',
          '/assets/sounds/relax-14.mp3',
          '/assets/sounds/relax-15.mp3',
          '/assets/sounds/relax-16.mp3',
          '/assets/sounds/relax-17.mp3',
          '/assets/sounds/relax-18.mp3',
          '/assets/sounds/relax-19.mp3',
          '/assets/sounds/relax-20.mp3',
          '/assets/sounds/relax-21.mp3',
          '/assets/sounds/relax-22.mp3',
          '/assets/sounds/relax-23.mp3',
          '/assets/sounds/relax-24.mp3',
          '/assets/sounds/relax-25.mp3',
        ];
        
        const shuffled = shuffleArray(ambientSounds);
        set({ 
          shuffledPlaylist: shuffled,
          currentTrackIndex: -1,
          playbackProgress: 0
        });
      }
    }),
    {
      name: 'audio-storage',
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        soundVolume: state.soundVolume,
        currentTrackIndex: state.currentTrackIndex,
        playbackProgress: state.playbackProgress,
        shuffledPlaylist: state.shuffledPlaylist
      })
    }
  )
);