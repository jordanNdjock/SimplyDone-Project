"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import {
  CalendarCheck,
  Bell,
  Star,
  ThumbsUp,
  ListChecks,
  Timer,
  MousePointerClick,
  Search,
  Github,
  Linkedin,
  Grid2X2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "../../ui/progress"
import Link from "next/link"

const guideSteps = [
  {
    title: "Bienvenue sur Simplydone ✔️",
    description:
      "Votre assistant personnel pour organiser vos tâches, les classer par priorité et rester concentré 🎯.",
    icon: <ListChecks className="w-10 h-10 text-blue-600" />,
  },
    {
    title: "Affichage par priorité ⭐",
    description:
      "Vos tâches sont classées par priorité pour mieux organiser votre journée.",
    icon: <Star className="w-10 h-10 text-yellow-500" />,
  },
  {
    title: "Mise à jour rapide ✏️",
    description:
      "Cliquez sur une tâche pour la modifier, ou sur ⋮ pour plus d’options. Maintenez pour supprimer.",
    icon: <MousePointerClick className="w-10 h-10 text-indigo-600" />,
  },
  {
    title: "Planifiez vos tâches 📅",
    description:
      "Ajoutez, modifiez et terminez vos tâches directement depuis le calendrier, tout en personnalisant son affichage.",
    icon: <CalendarCheck className="w-10 h-10 text-green-600" />,
    link: "/dashboard/calendrier",
  },
  {
    title: "Boostez avec Pomodoro ⏱️",
    description:
      "Lancez des sessions de travail de 25 min pour rester concentré. Vous pouvez les enchaîner selon votre rythme.",
    icon: <Timer className="w-10 h-10 text-rose-500" />,
    link: "/dashboard/pomodoro",
  },
  {
    title: "La matrice Eisenhower 🧠",
    description:
      "Organisez vos tâches par urgence et importance grâce à la matrice intégrée — glissez et déposez.",
    icon: <Grid2X2 className="w-10 h-10 text-teal-500" />,
    link: "/dashboard/matrice",
  },
  {
    title: "Recherchez facilement 🔍",
    description:
      "Utilisez la barre de recherche pour trouver rapidement une tâche par mot-clé.",
    icon: <Search className="w-10 h-10 text-cyan-600" />,
    link: "/dashboard/rechercher",
  },
  {
    title: "Activez les rappels 🔔",
    description:
      "Recevez des notifications pour ne rater aucune tâche importante.",
    icon: <Bell className="w-10 h-10 text-red-500" />,
  },
  {
    title: "Laissez votre avis 💬",
    description:
      "Notez l'app avec des étoiles dans les paramètres, et proposez des idées via la section Laisser un avis.",
    icon: <ThumbsUp className="w-10 h-10 text-purple-600" />,
  },
  {
    title: "Suivez-moi 🙌",
    description:
      "Suivez l’auteur de Simplydone sur LinkedIn et GitHub pour ne rien manquer. Rendez-vous dans les paramètres",
    icon: (
      <div className="flex gap-4 justify-center">
        <Linkedin className="w-7 h-7 text-blue-600" />
        <Github className="w-7 h-7 text-black dark:text-white" />
      </div>
    ),
  },
]

export default function WelcomeGuide({
  open,
  onFinish,
}: {
  open: boolean
  onFinish: () => void
}) {
  const [step, setStep] = useState(0)
  const isLast = step === guideSteps.length - 1

  const handleNext = () => {
    if (isLast) {
      onFinish()
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1)
  }

  const progress = ((step + 1) / guideSteps.length) * 100

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onFinish()}>
      <DialogContent className="sm:max-w-md rounded-lg text-center py-6 px-6">
        <Progress value={progress} className="mb-6 h-2 mt-5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-5 flex flex-col justify-between"
          >
            <div className="flex justify-center animate-bounce-slow">
              {guideSteps[step].icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-center">{guideSteps[step].title}</h2>
              <p className="text-muted-foreground text-sm text-center">{guideSteps[step].description}</p>
            </div>

            {guideSteps[step].link && (
              <div className="mt-2 flex justify-center">
                <Link
                  href={guideSteps[step].link}
                  className="px-3 py-1.5 text-xs rounded-md bg-muted text-muted-foreground hover:bg-muted/70 transition"
                >
                  Découvrir 🚀
                </Link>
              </div>
            )}
          </motion.div>

        </AnimatePresence>

        <div className="flex justify-between items-center pt-6 gap-2">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="w-1/3"
          >
             ← Précédent
          </Button>

          <Button onClick={handleNext} className="w-2/3">
            {isLast ? "Terminer 🎯" : "Suivant →"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
