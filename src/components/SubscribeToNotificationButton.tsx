"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { selectUser, useAuthStore } from "../store/authSlice";
import { toast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import { usePrefUserStore } from "../store/prefUserSlice";
import { getInitials } from "../utils/utils";

export default function SubscribeToNotificationsButton() {
  const [isSupported, setIsSupported] = useState(false);
  const { setNotificationSubscribed, notification_Subscribed } = usePrefUserStore();
  const [loading, setLoading] = useState(false);
  const user = useAuthStore(selectUser);

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

      const hasUser = OneSignal.User?.onesignalId;
      if (hasUser) {
        await OneSignal.logout();
      }

      const granted = await OneSignal.Notifications.permission;
      if (granted && user) {
        await OneSignal.login(user.$id);
        const subscription = OneSignal.User?.PushSubscription;
        await subscription?.optOut();
        await subscription?.optIn();
        setNotificationSubscribed(true);

        await fetch("/api/send-notifs", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            userId: user.$id,
            title: `👋 Bienvenue sur SimplyDone ${getInitials(user.name)}`,
            message: "Merci d’avoir activé les notifications. Vous serez désormais alerté en temps utile 😎",
            }),
        });

        toast({
            title: "✅ Notifications activées !",
            description:
                "Vous recevrez désormais des rappels pour vos tâches, échéances et activités importantes. Restez organisé(e) et ne manquez plus rien 🔔💪",
            variant: "success",
        });
      } else {
        try {
          console.log("test commence");
          await OneSignal.Notifications.requestPermission();
          console.log("test fini");
        } catch (err) {
            console.error("Erreur lors de la demande de permission :", err);
        }
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
          disabled={loading}
          className={`px-4 py-2 rounded outline-none text-black dark:text-white hover:text-white ${
            notification_Subscribed ? "bg-green-600" : loading ? "bg-primary" : "bg-transparent"
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
