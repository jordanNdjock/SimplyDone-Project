import Link from 'next/link';
import Footer from '../../components/Footer';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen flex-col">
        <Link href="/" className='mt-1'>
            <Button className="bg-accent hover:bg-purple-700 dark:bg-primary dark:hover:bg-blue-700"><ArrowLeft /> Retour à l&apos;accueil</Button>
        </Link>
        <div className="shadow-2xl rounded-md p-16 w-full max-w-4xl h-auto mt-8  font-mono text-left container">
          <h1 className="text-3xl font-bold text-center mb-6 text-accent dark:text-primary">Politique de confidentialité</h1>
          <p className="mb-4 sm:text-left">
            Chez <strong>SimplyDone</strong>, nous respectons votre vie privée et nous engageons à protéger vos données personnelles.
            Voici comment nous collectons, utilisons et protégeons vos informations.
          </p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-accent dark:text-primary">Navigation rapide</h2>
            <ul className="list-disc list-inside  space-y-2">
              <li><a href="#data-collection" className="text-accent dark:text-primary hover:underline">1. Données que nous collectons</a></li>
              <li><a href="#data-usage" className="text-accent dark:text-primary hover:underline">2. Utilisation des données</a></li>
              <li><a href="#data-security" className="text-accent dark:text-primary hover:underline">3. Sécurité</a></li>
              <li><a href="#cookies" className="text-accent dark:text-primary hover:underline">4. Cookies</a></li>
              <li><a href="#your-rights" className="text-accent dark:text-primary hover:underline">5. Vos droits</a></li>
              <li><a href="#changes" className="text-accent dark:text-primary hover:underline">6. Modifications de cette politique</a></li>
            </ul>
          </div>

          <h2 id="data-collection" className="text-lg font-semibold mt-4 mb-2 text-accent dark:text-primary">1. Données que nous collectons</h2>
          <p className="mb-4">
            Nous collectons vos informations personnelles (nom, e-mail, mot de passe), vos données d&apos;utilisation (pages visitées,
            actions effectuées) et vos données techniques (adresse IP, appareil utilisé, navigateur utilisé).
          </p>

          <h2 id="data-usage" className="text-lg font-semibold mt-4 mb-2 text-accent dark:text-primary">2. Utilisation des données</h2>
          <p className=" mb-4">
            Vos données nous permettent de fournir nos services, personnaliser votre expérience, vous envoyer des notifications, et
            respecter nos obligations légales.
          </p>

          <h2 id="data-security" className="text-lg font-semibold mt-4 mb-2 text-accent dark:text-primary">3. Sécurité</h2>
          <p className=" mb-4">
            Nous utilisons des technologies avancées (cryptage, pare-feu) pour protéger vos données contre tout accès non autorisé ou toute perte accidentelle.
          </p>

          <h2 id="cookies" className="text-lg font-semibold mt-4 mb-2 text-accent dark:text-primary">4. Cookies</h2>
          <p className=" mb-4">
            SimplyDone utilise des cookies pour analyser les performances de notre site et améliorer votre expérience. Vous pouvez
            gérer vos préférences de cookies dans les paramètres de votre navigateur.
          </p>

          <h2 id="your-rights" className="text-lg font-semibold mt-4 mb-2 text-accent dark:text-primary">5. Vos droits</h2>
          <p className=" mb-4">
            Vous avez le droit d&apos;accéder, de corriger ou de supprimer vos données personnelles. Pour exercer ces droits, contactez le développeur
            sur <a href="mailto:support@simplydone.com" className="text-accent dark:text-primary hover:underline">clothairegastalia@gmail.com</a>.
          </p>

          <h2 id="changes" className="text-lg font-semibold mt-4 mb-2 text-accent dark:text-primary">6. Modifications de cette politique</h2>
          <p className=" mb-4">
            Nous nous réservons le droit de modifier cette politique à tout moment. Toute mise à jour sera publiée sur cette page avec
            la date de dernière mise à jour.
          </p>

          <p className="text-center  mt-8">Dernière mise à jour : 06/12/2024</p>
        </div>

        <Footer />
      </div>
    </>
  );
}
