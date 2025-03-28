"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { useAuthStore } from "@/src/store/authSlice";

export function ToggleTheme() {
  const { setTheme } = useAuthStore();
  const { setTheme: setNextTheme } = useTheme();

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setNextTheme(newTheme);
  };

  return (
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="dark:hover:bg-black hover:bg-white rounded-full">
            <Sun className="text-yellow-500 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute text-blue-500 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")} className="cursor-pointer">
        <Sun className="text-yellow-500 h-[1.2rem] w-[1.2rem]" /> Clair
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="cursor-pointer">
        <Moon className="text-blue-500 h-[1.2rem] w-[1.2rem]" /> Sombre
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")} className="cursor-pointer">
        🖥️ Thème du système
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
