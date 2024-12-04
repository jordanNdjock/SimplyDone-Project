import Image from "next/image";
import { ToggleTheme } from '../components/ToggleTheme';
import { ArrowDownRight, CheckCheck, LogIn, UserRound } from 'lucide-react';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Separator } from "@/src/components/ui/separator";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="animate-pulse-slow flex h-20 shrink-0 items-center justify-end sm:justify-end md:justify-between lg:justify-between rounded-lg bg-gradient-to-l from-primary via-accent dark:from-primary dark:via-accent p-4 md:h-32">
           <Image
                  src="/assets/img/Logo.png"
                  width={100}
                  height={90} 
                  alt="Logo SimplyDone App"
                  className="hidden sm:hidden lg:block  md:block !animate-none"
              />
        <ToggleTheme />
      </div>

      <section className="py-12 px-10 sm:px-10">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <Badge variant="outline" className="flex items-center text-accent dark:text-primary mb-2">
                Beta
                <ArrowDownRight className="ml-2" size={18} />
              </Badge>

              <h1 className="my-6 text-pretty text-4xl font-bold lg:text-5xl">
                Bienvenue sur 
                <span className="flex items-center text-accent dark:text-primary">
                  SimplyDone
                  <CheckCheck className="ml-2 animate-bounce-slow" size={28} />
                </span>
              </h1>

              <p className="mb-8 max-w-xl text-muted-foreground text-sm sm:text-base lg:text-lg">
                SimplyDone est une application open-source de gestion de tâches avancée qui intègre la matrice d'Eisenhower et la méthode Pomodoro. Organisez vos priorités et optimisez votre productivité en fonction de vos objectifs.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
               
                <Button size="lg" variant="default" className="w-full sm:w-auto bg-accent hover:bg-purple-700 dark:bg-primary dark:hover:bg-blue-700 ">
                  Se connecter <LogIn className="ml-2" size={18} />
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                width={500}
                height={400}
                src="/assets/img/hero.png"
                alt="Illustration Hero"
                className="w-full max-w-sm md:max-w-md lg:max-w-4xl rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
