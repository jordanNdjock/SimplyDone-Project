import React from "react";
import { Button } from "@/src/components/ui/button";
import { Download } from "lucide-react";
import { usePWAInstall } from "@/src/hooks/usePWAInstall";

const InstallBanner: React.FC = () => {
  const { showToast, setShowToast, handleInstallClick, isInstalled } = usePWAInstall();

  if (!showToast || isInstalled) return null;

  return (
    <div className="fixed right-8 flex-col bottom-20 opacity-95 sm:right-4 sm:bottom-4 md:right-4 lg:right-4 z-50 p-4 md:bottom-4 lg:bottom-4 rounded-lg bg-gray-800 text-white shadow-lg flex items-center justify-between gap-4 w-[calc(100%-4rem)] max-w-sm">
      <div className="flex items-center">
        <span>Voulez-vous installer SimplyDone ?</span>
      </div>
      <div className="flex gap-3">
        <Button variant="default" onClick={handleInstallClick}>
          Installer <Download className="mr-2 animate-bounce" size={24} />
        </Button>
        <Button variant="destructive" onClick={() => setShowToast(false)}>
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default InstallBanner;
