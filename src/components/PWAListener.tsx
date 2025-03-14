"use client";
import { useEffect } from "react";
import { usePWAStore } from "../store/pwaSlice";

export default function PWAEventListener({ children }: { children: React.ReactNode }) {
  const { setInstallPrompt, setIsInstalled, setShowToast } = usePWAStore();

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
  }, [setInstallPrompt, setIsInstalled, setShowToast]);

  return <>{children}</>;
}
