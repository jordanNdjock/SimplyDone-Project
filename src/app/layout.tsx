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
