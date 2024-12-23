import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from "next";
import LoginForm from '@/src/components/login';

export const metadata: Metadata = {
    title: "Se connecter",
    description: "Connectez-vous à SimplyDone",
};

const Login: React.FC = () => {
  return (
    <section className="pb-32">
      <div className="container">
        <Link href="/" className="flex items-start justify-start pt-4 ml-6">
            <ArrowLeft className="size-12 lg:size-7 md:size-7 text-accent dark:text-primary sm:size-12 hover:text-accent" />
            <p className="text-primary dark:text-white font-bold ml-2 lg:visible invisible hover:text-accent">Retour à l&apos;accueil</p>
        </Link>
        <div className="flex flex-col gap-4">
          <div className="relative flex flex-col items-center overflow-hidden pb-2 pt-8">
            <Image
              priority
              width={500}
              height={400}
              src="/assets/img/Logo.png"
              alt="logo"
              className="mb-4 h-20 w-auto"
            />
            <p className="text-2xl font-bold">Se connecter</p>
            <p className="text-muted-foreground mt-1"> Connectez-vous à SimplyDone !</p>
          </div>
          <LoginForm />
          <div className="mx-auto mt-3 flex justify-center gap-1 text-sm text-muted-foreground">
            <span>Vous n&apos;avez pas de compte ?</span>
            <Link href="/auth/signup" className="font-medium text-accent dark:text-primary">
              Inscrivez-vous
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;


