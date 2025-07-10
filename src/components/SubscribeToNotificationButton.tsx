"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { useAuthStore } from "../store/authSlice";
import { toast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { usePrefUserStore } from "../store/prefUserSlice";

export default function SubscribeToNotificationsButton() {
  const [isSupported, setIsSupported] = useState(false);
  const { setNotificationSubscribed, notification_Subscribed } = usePrefUserStore((state) => state);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const checkSupportAndStatus = async () => {
      if (typeof window === "undefined") return;

      const supported = await OneSignal.Notifications.isPushSupported();
      setIsSupported(supported);
    };

    checkSupportAndStatus();
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const permission = await OneSignal.Notifications.permission;
      if (permission) {
        await OneSignal.Notifications.requestPermission();
      }

       await OneSignal.logout();
       await OneSignal.Slidedown.promptPush();
       setNotificationSubscribed(false);

      const granted = await OneSignal.Notifications.permission;
      if (granted && user) {
        await OneSignal.login(user.$id);
        const subscription = OneSignal.User?.PushSubscription;
        await subscription?.optOut();
        await subscription?.optIn();
        setNotificationSubscribed(true);
        toast({
            title: "✅ Notifications activées !",
            description:
                "📅 Vous recevrez désormais des rappels pour vos tâches, échéances et activités importantes. Restez organisé(e) et ne manquez plus rien 🔔💪",
            variant: "success",
        });
      } else {
        toast({
            title: "⚠️ Permission refusée",
            variant: "warning"
        });
      }
    } catch (e) {
      toast({
        title: "❌ Erreur de souscription",
        variant: "error",
        });
      console.error("❌ Erreur de souscription :", e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
     {isSupported ? (
        <Button
          onClick={subscribe}
          className={`px-4 py-2 rounded text-white ${
            notification_Subscribed ? "bg-green-600" : loading ? "bg-gray-400" : "bg-tranparent hover:bg-blue-700"
        }`}
        >
          {loading
            ? "⏳ Activation en cours..."
            : notification_Subscribed
            ? "✅ Notifications activées"
            : "🔔 Activer les notifications"
            }
        </Button>
      ) : (
        <p className="text-xs md:text-md text-center">🚫 Les notifications push ne sont pas supportées sur cet appareil.</p>
      )}
    </>
  );
}
