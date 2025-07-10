"use client";

import { useEffect, useState } from "react";
import OneSignal from "react-onesignal";

export default function SubscribeToNotificationsButton() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSupportAndStatus = async () => {
      if (typeof window === "undefined") return;

      const supported = await OneSignal.Notifications.isPushSupported();
      setIsSupported(supported);

      if (supported) {
        const permission = await OneSignal.Notifications.permission;
        const subscription = OneSignal.User?.PushSubscription;
        setIsSubscribed(permission && !!subscription?.optedIn);
      }
    };

    checkSupportAndStatus();
  }, []);

  const subscribe = async () => {
    try {
      const permission = await OneSignal.Notifications.permission;
      if (permission) {
        await OneSignal.Notifications.requestPermission(); // déclenche la popup navigateur
      }

      const subscription = OneSignal.User?.PushSubscription;
      await subscription?.optIn();

      const granted = await OneSignal.Notifications.permission;
      if (granted) {
        setIsSubscribed(true);
        console.log("✅ Souscription réussie !");
      } else {
        console.warn("⚠️ Permission refusée");
      }
    } catch (e) {
      console.error("❌ Erreur de souscription :", e);
    }
  };

  return (
    <>
      {isSupported ? (
        <button
          onClick={subscribe}
          disabled={isSubscribed}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {isSubscribed ? "✅ Notifications activées" : "🔔 Activer les notifications"}
        </button>
      ) : (
        <p>🚫 Les notifications push ne sont pas supportées sur cet appareil.</p>
      )}
    </>
  );
}
