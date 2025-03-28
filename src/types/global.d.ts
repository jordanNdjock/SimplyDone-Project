interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string[] }>;
  }


interface Window {
    __ONE_SIGNAL_INITIALIZED__?: boolean;
}
