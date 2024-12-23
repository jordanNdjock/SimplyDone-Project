"use client";

import React, { useEffect } from "react";
import { useAuthStore, selectUser} from "@/src/store/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "@/src/hooks/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const { fetchUser } = useAuthStore();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
      toast({
        title: "Déconnexion réussie 🚀",
        variant: "success",
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      toast({
        title: "Erreur lors de la déconnexion",
        description: message,
        variant: "error",
      });
    }
  }

  useEffect(() => {
    fetchUser();
  }
  );

  return (
      <div className="min-h-screen flex flex-col items-center justify-center ">
        <h1 className="text-2xl font-bold text-accent">Bienvenue, {user?.name}!</h1>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>
  );
}
