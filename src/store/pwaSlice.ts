import { create } from "zustand";

interface PWAState {
  installPrompt: BeforeInstallPromptEvent | null;
  showToast: boolean;
  isInstalled: boolean;
  setInstallPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  setShowToast: (show: boolean) => void;
  setIsInstalled: (installed: boolean) => void;
  handleInstallClick: () => Promise<void>;
}

export const usePWAStore = create<PWAState>((set, get) => ({
  installPrompt: null,
  showToast: false,
  isInstalled: false,
  setInstallPrompt: (prompt) => set({ installPrompt: prompt }),
  setShowToast: (show) => set({ showToast: show }),
  setIsInstalled: (installed) => set({ isInstalled: installed }),
  handleInstallClick: async () => {
    const prompt = get().installPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(
        outcome === "accepted"
          ? "L'utilisateur a accepté d'installer la PWA."
          : "L'utilisateur a refusé d'installer la PWA."
      );
      set({ showToast: false, installPrompt: null });
    }
  },
}));
