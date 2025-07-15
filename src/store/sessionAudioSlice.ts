import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { shuffleArray } from '@/src/lib/utils';
import { useTimerStore } from "./sessionTimerSlice";
import { isMobileDevice } from "../utils/utils";

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

        if ('mediaSession' in navigator) {
        let mediaSessionInterval: NodeJS.Timeout | null = null;
        const updateMedia = () => {
            const timerState = useTimerStore.getState();
            const timeLeft = timerState.timeLeft;
            const getMediaTitle = () => {
              return timerState.isLongBreak 
                ? "Pause longue 🌴" 
                : timerState.isWorkSession 
                  ? "⏳ Travail en cours" 
                  : "☕ Pause ";
            };
            function formatTimeLeft(seconds: number): string {
              const minutes = isMobileDevice() ? Math.floor(seconds / 60) + 1 : Math.floor(seconds / 60);
              const min = minutes.toString().padStart(2,'0');
              const sec = (seconds % 60).toString().padStart(2, "0");
              return isMobileDevice()
                ? `${minutes < 2 ? min + " min restante" : min + " min restantes"}`
                : `${min}:${sec}`;
            }
            const updateMediaMetadata = () => {
              navigator.mediaSession.metadata = new MediaMetadata({
                title: getMediaTitle(),
                artist: `${formatTimeLeft(timeLeft)}`,
                album: "Simplydone",
                artwork: [
                  { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
                  { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
                ]
              });
            };
            updateMediaMetadata();
            
            navigator.mediaSession.setActionHandler("play", () => {
              get().togglePlayback();
              updateMediaMetadata();
            });

            navigator.mediaSession.setActionHandler("pause", () => {
                get().togglePlayback();
                updateMediaMetadata();
            });

            navigator.mediaSession.setActionHandler("seekbackward", null);
            navigator.mediaSession.setActionHandler("seekforward", null);
            navigator.mediaSession.setActionHandler("seekto", null);
            navigator.mediaSession.setActionHandler("stop", null);

          };

          // if (mediaSessionInterval) clearInterval(mediaSessionInterval);

          // const intervalDelay = isMobileDevice() ? 60_000 : 1000;

          mediaSessionInterval = setInterval(() => {
            updateMedia();
          }, 1000);
        }

      
        set({ audioElement: audio });
      },      

      // Lecture/Pause
      togglePlayback: () => {
        const { audioElement, isPlaying, shuffledPlaylist, currentTrackIndex, soundVolume, soundEnabled } = get();
        if (!audioElement) return;

        if (isPlaying) {
          audioElement.pause();
          set({ isPlaying: false });
        } else {
          if (shuffledPlaylist.length === 0) get().shufflePlaylist();
          
          const trackIndex = currentTrackIndex === -1 ? 0 : currentTrackIndex;
          audioElement.src = get().shuffledPlaylist[trackIndex];
          audioElement.currentTime = get().playbackProgress;
          if(soundEnabled) audioElement.volume = soundVolume
          else audioElement.muted = true;
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
        completionAudio.volume = 1.0;
        completionAudio.play().catch(e => console.error("Erreur son de complétion:", e));
        if ("vibrate" in navigator) {
          navigator.vibrate([500, 300, 800, 300, 1000]);
        }
      },

      // Activation/Désactivation du son
      toggleSound: () => {
        set((state) => {
          const newState = !state.soundEnabled;
          if (state.audioElement) {
            state.audioElement.muted = !newState;
            state.audioElement.volume = newState ? state.soundVolume : 0.0;
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