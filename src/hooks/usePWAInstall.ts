"use client";
import { useEffect, useState } from "react";

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      if (isStandalone) {
        setIsInstalled(true);
        setShowToast(false);
      }
    };

    const handleAppInstalled = () => {
      console.log("PWA installée !");
      setIsInstalled(true);
      setShowToast(false);
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowToast(true);
    };

    checkIfInstalled();
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("resize", checkIfInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("resize", checkIfInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult) => {
        console.log(
          choiceResult.outcome === "accepted"
            ? "L'utilisateur a accepté d'installer la PWA."
            : "L'utilisateur a refusé d'installer la PWA."
        );
        setShowToast(false);
        setInstallPrompt(null);
      });
    }
  };

  return { showToast, setShowToast, handleInstallClick, isInstalled };
}
