"use client";

import React, { useState, useEffect } from "react";
import OneSignal from "react-onesignal";
import { Bell } from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import { Switch } from "../ui/switch";

export function NotificationToggle() {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const oneSignal = (window as any).OneSignal;
      if (oneSignal && typeof oneSignal.push === "function") {
        oneSignal.push(() => {
          // Vérifier que la méthode isPushNotificationsEnabled existe
          if (typeof oneSignal.isPushNotificationsEnabled === "function") {
            oneSignal.isPushNotificationsEnabled((isEnabled: boolean) => {
              setNotificationsEnabled(isEnabled);
            });
          } else {
            console.warn("oneSignal.isPushNotificationsEnabled n'existe pas");
          }
        });
      } else {
        console.warn("window.OneSignal.push n'est pas disponible.");
      }
    }
  }, []);

  const handleSwitchChange = (checked: boolean) => {
    setNotificationsEnabled(checked);
    if (typeof window !== "undefined") {
      const oneSignal = (window as any).OneSignal;
      if (oneSignal && typeof oneSignal.push === "function") {
        oneSignal.push(() => {
          if (typeof oneSignal.setSubscription === "function") {
            oneSignal.setSubscription(checked);
          } else {
            console.warn("oneSignal.setSubscription n'existe pas");
          }
        });
      }
    }
  };

  return (
    <div className="border shadow-sm rounded-lg">
      <div className="flex items-center rounded-md p-3">
        <Bell className="text-gray-300 mr-3" />
        <span className="flex-1">Notifications</span>
        <Switch
          className="mr-2"
          checked={notificationsEnabled}
          onCheckedChange={handleSwitchChange}
        />
      </div>
    </div>
  );
}
