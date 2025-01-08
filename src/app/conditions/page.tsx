import Link from 'next/link';
import Footer from '../../components/layout/Footer';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <>
      <main className="flex items-center justify-center min-h-screen  flex-col">
        <Link href="/" className="mt-1">
          <Button className="bg-secondary hover:bg-purple-700 dark:bg-primary dark:hover:bg-blue-700">
            <ArrowLeft /> Retour à l&apos;accueil
          </Button>
        </Link>
        <div className="shadow-2xl rounded-md p-16 w-full max-w-4xl h-auto mt-8 font-mono text-left">
          <h1 className="text-3xl font-bold text-center mb-6 text-secondary dark:text-primary">
            Conditions d&apos;utilisation
          </h1>
          <p className="mb-4 sm:text-left">
            Bienvenue sur <strong>SimplyDone</strong>. En accédant à notre application ou en l&apos;utilisant, vous acceptez nos
            conditions d&apos;utilisation. Voici les termes qui régissent l&apos;utilisation de notre plateforme.
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-secondary dark:text-primary">Navigation rapide</h2>
            <ul className="list-disc list-inside  space-y-2">
              <li>
                <a href="#acceptance" className="text-secondary dark:text-primary hover:underline">
                  1. Acceptation des conditions
                </a>
              </li>
              <li>
                <a href="#usage" className="text-secondary dark:text-primary hover:underline">
                  2. Utilisation de l&apos;application
                </a>
              </li>
              <li>
                <a href="#account" className="text-secondary dark:text-primary hover:underline">
                  3. Création et gestion de compte
                </a>
              </li>
              <li>
                <a href="#liability" className="text-secondary dark:text-primary hover:underline">
                  4. Limitation de responsabilité
                </a>
              </li>
              <li>
                <a href="#termination" className="text-secondary dark:text-primary hover:underline">
                  5. Résiliation
                </a>
              </li>
              <li>
                <a href="#changes" className="text-secondary dark:text-primary hover:underline">
                  6. Modifications des conditions
                </a>
              </li>
            </ul>
          </div>

          <h2 id="acceptance" className="text-lg font-semibold mt-4 mb-2 text-secondary dark:text-primary">
            1. Acceptation des conditions
          </h2>
          <p className=" mb-4">
            En utilisant SimplyDone, vous acceptez ces conditions dans leur intégralité. Si vous n&apos;êtes pas d&apos;accord avec une
            partie de ces conditions, vous ne devez pas utiliser notre application.
          </p>

          <h2 id="usage" className="text-lg font-semibold mt-4 mb-2 text-secondary dark:text-primary">
            2. Utilisation de l&apos;application
          </h2>
          <p className=" mb-4">
            Vous acceptez de ne pas utiliser l&apos;application à des fins illégales ou non autorisées. Vous êtes responsable de toutes
            les activités effectuées depuis votre compte.
          </p>

          <h2 id="account" className="text-lg font-semibold mt-4 mb-2 text-secondary dark:text-primary">
            3. Création et gestion de compte
          </h2>
          <p className=" mb-4">
            Vous devez fournir des informations exactes et à jour lors de la création de votre compte. Il est de votre responsabilité
            de protéger vos informations de connexion.
          </p>

          <h2 id="liability" className="text-lg font-semibold mt-4 mb-2 text-secondary dark:text-primary">
            4. Limitation de responsabilité
          </h2>
          <p className=" mb-4">
            SimplyDone ne peut être tenu responsable des pertes ou dommages résultant de l&apos;utilisation de notre application.
          </p>

          <h2 id="termination" className="text-lg font-semibold mt-4 mb-2 text-secondary dark:text-primary">
            5. Résiliation
          </h2>
          <p className=" mb-4">
            Nous nous réservons le droit de suspendre ou de supprimer votre compte en cas de non-respect de ces conditions. Vous pouvez
            également résilier votre compte à tout moment.
          </p>

          <h2 id="changes" className="text-lg font-semibold mt-4 mb-2 text-secondary dark:text-primary">
            6. Modifications des conditions
          </h2>
          <p className=" mb-4">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Toute mise à jour sera publiée sur cette page avec
            la date de dernière mise à jour.
          </p>

          <p className="text-center text-gray-500 mt-8">Dernière mise à jour : 05/12/2024</p>
        </div>

        <Footer />
      </main>
    </>
  );
}
