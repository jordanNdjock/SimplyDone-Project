"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useAuthStore, selectAuthenticated } from "@/src/store/authSlice";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAuthenticated = useAuthStore(selectAuthenticated);
  const { fetchUser, listenToAppwrite } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker enregistré avec succès :", registration.scope);
        })
        .catch((err) => {
          console.error("Erreur lors de l'enregistrement du Service Worker :", err);
        });
    }
  }, []);
  
  useEffect(() => {
    listenToAppwrite();
    const checkAuthentication = async () => {
      try {
        await fetchUser();
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.replace("/auth/login");
      }
    };

    checkAuthentication();
  }, [fetchUser, router, listenToAppwrite]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-md lg:text-3xl md:text-3xl text-accent dark:text-primary flex">
          <LoaderCircle className="animate-spin" size={80} />
        </p>
      </div>
    );
  }

  if (!userAuthenticated) {
    return null;
  }

  return <Suspense>{children}</Suspense>;
}
