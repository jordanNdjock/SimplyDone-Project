import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Download } from "lucide-react";

const InstallBanner: React.FC = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showToast, setShowToast] = useState(false);
  
    
    useEffect(() => {
      
      const checkIfInstalled = () => {
        if (window.matchMedia("(display-mode: standalone)").matches) {
          setShowToast(false);
        }
      };
  
      checkIfInstalled();
  
      const handleAppInstalled = () => {
        console.log("PWA installée !");
        setShowToast(false);
      };
  
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const handleBeforeInstallPrompt = (e:any) => {
        e.preventDefault();
        setInstallPrompt(e);
          setShowToast(true);
      };
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);
  
      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }, []);
  
    const handleInstallClick = () => {
      if (installPrompt) {
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("L'utilisateur a accepté d'installer la PWA.");
          } else {
            console.log("L'utilisateur a refusé d'installer la PWA.");
          }
          setShowToast(false);
          setInstallPrompt(null);
        });
      }
    };
  
    const handleCloseToast = () => {
      setShowToast(false)
    };

  if (!showToast) return null;

  return (
    <div className="fixed right-8 flex-col bottom-20 opacity-95 sm:right-4 sm:bottom-4 md:right-4 lg:right-4 z-50 p-4 md:bottom-4  lg:bottom-4 rounded-lg bg-gray-800 text-white shadow-lg flex items-center justify-between gap-4 w-[calc(100%-4rem)] max-w-sm">
        <div className="flex items-center">
          <span>Voulez-vous installer SimplyDone ?</span>
        </div>
        <div className="flex gap-3">
          <Button variant="default" onClick={handleInstallClick}>
            Installer  <Download className="mr-2 animate-bounce" size={24} />
          </Button>
          <Button variant="destructive" onClick={handleCloseToast}>
            Fermer
          </Button>
        </div>
      </div>
  );
};

export default InstallBanner;
