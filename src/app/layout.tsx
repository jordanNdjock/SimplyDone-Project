import type { Metadata } from "next";
import "./config/globals.css";
import { inter } from "./config/font";
import { ThemeProvider } from "@/src/components/theme/theme-provider";
import { Toaster } from '@/src/components/ui/toaster';
import { Analytics } from "@vercel/analytics/react"
import PWAEventListener from "../components/PWAListener";
// import Script from "next/script";

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "SimplyDone App"
  },
  description: "A simple advanced to-do list app built with Next.js, Appwrite, and Tailwind CSS.",
  metadataBase: new URL('https://simplydone.vercel.app'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/icons/icon-192x192.png" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="SimplyDone App est une todo avancée" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          {/* <Script
          id="onesignal-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/firebase-messaging-sw.js')
                  .then(function(registration) {
                    console.log('OneSignal Service Worker registered with scope:', registration.scope);
                  })
                  .catch(function(error) {
                    console.error('Service Worker registration failed:', error);
                  });
              }
            `,
          }}
        />
          <Script id="onesignal-init" strategy="afterInteractive">
            {`
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({
                  appId: "6c3468be-0c5d-4407-a609-b3a62cb4b4d3",
                  notifyButton: {
                    enable: true,
                  },
                });
              });
            `}
          </Script> */}
        </head>
        
      <body
        className={`${inter.className} antialiased`}
      >

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <PWAEventListener>
              {children}
              <Toaster />
              <Analytics />
            </PWAEventListener>
          </ThemeProvider>
      </body>
    </html>
  );
}
