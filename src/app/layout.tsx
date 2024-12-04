import type { Metadata } from "next";
import "./config/globals.css";
import { inter } from "./config/font";
import { ThemeProvider } from "@/src/components/theme-provider";

export const metadata: Metadata = {
  title: "SimplyDone App",
  description: "A simple advanced to-do list app built with Next.js, Appwrite, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
