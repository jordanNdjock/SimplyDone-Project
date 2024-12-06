import type { Metadata } from "next";
import "./config/globals.css";
import { inter } from "./config/font";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from '@/src/components/ui/toaster';

export const metadata: Metadata = {
  title: {
    template: "%s | SimplyDone App",
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
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} antialiased h-full`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>

      </body>
    </html>
  );
}
