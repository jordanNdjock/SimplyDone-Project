"use client";
import React, { useState } from "react";

import { Info, ChevronRight, Shield, UserRoundCheck, Linkedin, Share2, BadgeCheck, Github, Download, Paintbrush, Headset, MessageSquareText, Star, BookOpen } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaTelegram, FaLinkedin, FaShieldAlt } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { getInitials, getOriginalImageUrl } from "@/src/utils/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { usePWAStore } from "@/src/store/pwaSlice";
import { ToggleTheme } from "../theme/ToggleTheme";
import BackToPage from "../layout/BackToPage";
import { FaXTwitter } from "react-icons/fa6";
import { TbContract } from "react-icons/tb";
import AddSuggestionModal from "../dialogs/suggestion/AddSuggestionModal";
import { NotificationToggle } from "./NotificationToggle";
import WelcomeGuide from "../dialogs/welcomeGuide/WelcomeGuide";


export default function SettingsComponent() {
  const user = useAuthStore(selectUser);
  const {handleInstallClick, isInstalled } = usePWAStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false)

  return (
<>
    <BackToPage title="Paramètres" />
    <div className="px-4">
      <Card className="">
        <CardContent>
          <Link href="/dashboard/profil" className="flex items-center gap-4 pt-4 cursor-pointer">
          <Avatar className="h-16 w-16 rounded-full">
            <AvatarImage src={getOriginalImageUrl(user?.avatarUrl ?? "") || ""} alt={user?.name} />
            <AvatarFallback className="text-xl font-bold bg-gray-200 text-gray-600">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
            <div>
              <h2 className="text-lg font-semibold flex gap-2">{user?.name || "Utilisateur"} 
                {user?.role && user?.role == "admin" ? <BadgeCheck className="w-5 h-5 mt-1"/> : <Shield className="w-5 h-5 mt-1"/>}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>depuis le {user?.registeredAt ? format(new Date(user?.registeredAt), "PPP", {locale: fr}) : '-'}</span>
              </div>
            </div>
          </Link>

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

        {/* installer l'application */}
        {!isInstalled && <div className="border shadow-sm rounded-lg bg-gradient-to-r from-primary via-gray-500 to-accent">
          <Link href="" className="flex items-center rounded-md p-3" onClick={handleInstallClick}>
            <Download className="text-gray-300 mr-3 animate-bounce" />
            <span className="flex-1 text-white">Installer SimplyDone</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>}

        {/* Thème */}
        <div className="border shadow-sm rounded-lg">
          <div className="flex items-center rounded-md p-3">
            <Paintbrush className="text-gray-400 dark:text-gray-300 mr-3" />
            <span className="flex-1">Thème de l&apos;application</span>
            <ToggleTheme  />
          </div>
        </div>
        {/* Notifications */}
        <NotificationToggle />
        
        {/* Suivre l'auteur*/}
        <div className="border shadow-sm rounded-lg">
          <Link href="https://www.linkedin.com/in/jordan-ndjock-a58a02252" className="flex items-center rounded-md p-3" target="_blank">
            <UserRoundCheck className="text-gray-400 dark:text-gray-300 mr-3" />
            <span className="flex-1">Suivre l&apos;auteur</span>
            <Linkedin className="text-gray-400 dark:text-gray-300 mr-3" />
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Laisser son avis*/}
        <div className="border shadow-sm rounded-lg">
            <Link href="" className="flex items-center rounded-md p-3" onClick={(e) => {
              e.preventDefault();
              setModalOpen(true);
            }}>
            <MessageSquareText className="text-gray-400 dark:text-gray-300 mr-3" />
            <span className="flex-1">Laisser un avis</span>
            <Star className="dark:text-yellow-300 text-yellow-400 mr-3" />
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Crédits */}
        <div className="border shadow-sm rounded-lg">
          <Link href="https://www.github.com/jordanNdjock" className="flex items-center rounded-md p-3" target="_blank">
            <BadgeCheck className="text-gray-400 dark:text-gray-300 mr-3" />
            <span className="flex-1">Voir les crédits</span>
            <Github className="text-gray-400 dark:text-gray-300 mr-3" />
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Guide d'utilisation */}
        <div className="border shadow-sm rounded-lg">
          <Link href="" className="flex items-center rounded-md p-3" onClick={(e) => {
            e.preventDefault();
            setShowGuide(true);
          }}>
            <BookOpen className="text-gray-400 dark:text-gray-300 mr-3" />
            <span className="flex-1">Guide d&apos;utilisation</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Conditions d'utilisation */}
        <div className="border shadow-sm rounded-lg">
          <Link href="/conditions" className="flex items-center rounded-md p-3">
            <TbContract className="text-gray-400 dark:text-gray-300 mr-3" size={20} />
            <span className="flex-1">Conditions d&apos;utilisation</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Privacy Policy */}
        <div className="border shadow-sm rounded-lg">
          <Link href="/privacy" className="flex items-center rounded-md p-3">
            <FaShieldAlt className="text-gray-400 dark:text-gray-300 mr-3" size={20} />
            <span className="flex-1">Politiques de confidentialité</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
        {/* Besoin d'assistance */}
        <div className="border shadow-sm rounded-lg">
          <Link 
           href={`https://wa.me/+237695380197?text=${encodeURIComponent("Assistance SimplyDone App : Salut Admin, j'aimerais avoir d'assistance pour faire une tâche")}`} target="_blank"
           rel="noopener noreferrer"
           className="flex items-center rounded-md p-3">
            <Headset className="text-gray-400 dark:text-gray-300 mr-3" size={20} />
            <span className="flex-1">Besoin d&apos;assistance</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>
      {/* Bouton Partager */}
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex items-center p-3 cursor-pointer border shadow-sm rounded-lg">
            <Share2 className="text-gray-400 dark:text-gray-300 mr-3" />
            <span className="flex-1">Partager cette application</span>
            <ChevronRight className="text-gray-400" />
          </div>
        </SheetTrigger>
        <SheetContent className=" text-white w-full md:w-[400px] justify-items-center  items-center" side="bottom">
          <h3 className="text-lg font-semibold mb-4 text-gray-500 dark:text-white">Partager sur les réseaux sociaux</h3>
          <div className="flex gap-4">
          <Link 
              href={`https://wa.me/?text=${encodeURIComponent("Découvrez SimplyDone : l'appli de productivité ultime ! Organisez vos tâches avec une todolist avancée, priorisez grâce à la matrice d'Eisenhower, et boostez votre concentration avec la méthode Pomodoro. Essayez-la dès maintenant : https://simplydone.vercel.app")}`} target="_blank"
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
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  "https://simplydone.vercel.app"
                )}&text=${encodeURIComponent(
                  "Découvrez SimplyDone 🚀 : l'appli de productivité ultime ! Organisez vos tâches avec une todolist avancée, priorisez grâce à la matrice d'Eisenhower 🔥, et boostez votre concentration avec la méthode Pomodoro 🍅. Essayez-la dès maintenant !"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className="mr-2 h-10 w-10 text-gray-300" />
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
      <div className="flex justify-items-end rounded-md w-full p-3 mt-8 text-gray-400">
        <Info className="text-gray-400 mr-3" />
        <span className="flex-1">SimplyDone App 1.3.0 - LJN</span>
      </div>
    </div>

    <AddSuggestionModal open={modalOpen} onOpenChange={setModalOpen} />
    <WelcomeGuide open={showGuide} onFinish={() => setShowGuide(false)} />
</>
  );
}
