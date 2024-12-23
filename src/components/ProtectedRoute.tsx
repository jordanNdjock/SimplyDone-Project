"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore, selectAuthenticated } from "@/src/store/authSlice";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAuthenticated = useAuthStore(selectAuthenticated);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await fetchUser();
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        router.replace("/auth/login");
      }
    };

    checkAuthentication();
  }, [fetchUser, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-md lg:text-3xl md:text-3xl text-accent dark:text-primary flex">
          <LoaderCircle className="animate-spin mr-2" size={30} />
          Vérification de l&apos;authentification...
        </p>
      </div>
    );
  }

  if (!userAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
