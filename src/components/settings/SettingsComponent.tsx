"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, ChevronRight, Shield, Forward, UserRoundCheck, Linkedin, Share2, BadgeCheck, Github } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTelegram, FaLinkedin } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { getInitials } from "@/src/utils/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
export default function SettingsComponent() {
  const router = useRouter();
  const user = useAuthStore(selectUser);

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center mb-4 mt-1 text-accent dark:text-white">
        <ArrowLeft
          className="cursor-pointer mr-2"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-semibold">Paramètres</h1>
      </div>

      <Card className="">
        <CardContent>
          <div className="flex items-center gap-4 pt-4">
          <Avatar className="h-16 w-16 rounded-full border-2 border-gray-200 hover:border-gray-500 transition duration-300">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
            <div>
              <h2 className="text-lg font-semibold flex gap-2">{user?.name || "Utilisateur"} <Shield className="w-5 h-5 mt-1"/></h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>depuis le {user?.registeredAt ? format(new Date(user?.registeredAt), "PPP", {locale: fr}) : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Compte Premium */}
          {/* <div className="bg-[#292929] rounded-md p-3 mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-200">
              <p className="font-semibold">Compte Premium</p>
              <p className="text-xs text-gray-400">Vue calendrier et autres fonctionnalités</p>
            </div>
            <Button variant="default" className="mt-2 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white">
              METTRE À JOUR MAINTENANT
            </Button>
          </div> */}
        </CardContent>
      </Card>

      {/* Liste des Paramètres */}
      <div className="mt-4 space-y-2">
        {/* Recommandation d'amis */}
        <div className="">
          <Link href="https://www.linkedin.com/in/jordan-ndjock-a58a02252" className="flex items-center rounded-md p-3" target="_blank">
            <UserRoundCheck className="text-gray-300 mr-3" />
            <span className="flex-1">Suivre l'auteur</span>
            <Linkedin className="text-gray-300 mr-3" />
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Crédits */}
        <div className="">
          <Link href="https://www.github.com/jordanNdjock" className="flex items-center rounded-md p-3" target="_blank">
            <BadgeCheck className="text-gray-300 mr-3" />
            <span className="flex-1">Voir les crédits</span>
            <Github className="text-gray-300 mr-3" />
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Conditions d'utilisation */}
        <div className="">
          <Link href="/conditions" className="flex items-center rounded-md p-3">
            <span className="text-gray-300 mr-3">📄</span>
            <span className="flex-1">Conditions d'utilisation</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Privacy Policy */}
        <div className="">
          <Link href="/privacy" className="flex items-center rounded-md p-3">
            <span className="text-gray-300 mr-3">🔒</span>
            <span className="flex-1">Politiques de confidentialité</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
      {/* Bouton Partager */}
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex items-center rounded-md p-3">
            <Share2 className="text-gray-300 mr-3 cursor-pointer" />
            <span className="flex-1">Partager cette application</span>
            <ChevronRight className="text-gray-400" />
          </div>
        </SheetTrigger>
        <SheetContent className=" text-white w-full md:w-[400px]" side="bottom">
          <h3 className="text-lg font-semibold mb-4">Partager sur les réseaux sociaux</h3>
          <div className="flex gap-4">
          <Link 
              href={`https://wa.me/?text=${encodeURIComponent("Découvrez SimplyDone : l'appli de productivité ultime ! Organisez vos tâches avec une todolist avancée, priorisez grâce à la matrice d'Eisenhower, et boostez votre concentration avec la méthode Pomodoro. Essayez-la dès maintenant : https://simplydone.vercel.app")}`}              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="mr-2 h-10 w-10 text-green-600" />
            </Link>
            <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  "https://simplydone.vercel.app"
                )}&quote=${encodeURIComponent(
                  "Découvrez SimplyDone 🚀 : l'appli de productivité ultime ! Organisez vos tâches avec une todolist avancée, priorisez grâce à la matrice d'Eisenhower 🔥, et boostez votre concentration avec la méthode Pomodoro 🍅. Essayez-la dès maintenant !"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="mr-2 h-10 w-10 text-blue-600" />
              </Link>

            <Link
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  "https://simplydone.vercel.app"
                )}&text=${encodeURIComponent(
                  "Découvrez SimplyDone 🚀 : l'appli de productivité ultime ! Organisez vos tâches avec une todolist avancée, priorisez grâce à la matrice d'Eisenhower 🔥, et boostez votre concentration avec la méthode Pomodoro 🍅. Essayez-la dès maintenant !"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram className="mr-2 h-10 w-10 text-blue-400" />
              </Link>

              <Link
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    "https://simplydone.vercel.app"
                  )}&title=${encodeURIComponent("Découvrez SimplyDone 🚀")}&summary=${encodeURIComponent(
                    "L'appli de productivité ultime ! Organisez vos tâches avec une todolist avancée, priorisez grâce à la matrice d'Eisenhower 🔥, et boostez votre concentration avec la méthode Pomodoro 🍅. Essayez-la dès maintenant !"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="mr-2 h-10 w-10 text-blue-700" />
              </Link>

          </div>
        </SheetContent>
      </Sheet>
       
      </div>
      {/* Version */}
      <div className="flex items-center rounded-md p-3 justify-center mt-8">
        <Info className="text-gray-300 mr-3" />
        <span className="flex-1">SimplyDone 0.4.2 - LJN</span>
      </div>
    </div>
  );
}
