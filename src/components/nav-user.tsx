"use client"

import {
  ChevronsUpDown,
  LogOut,
  UserRound,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/ui/sidebar"
import { User } from "../models/user"
import { useRouter } from "next/navigation";
import { toast } from "@/src/hooks/use-toast";
import { useAuthStore } from "../store/authSlice"
import Link from "next/link"

export function NavUser({
  user,
}: {
  user: User | null
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { logout } = useAuthStore();

  const getInitials = (name?: string): string | null => {
    if (!name || name.trim().length === 0) {
      return null;
    }
  
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0].toUpperCase()}${names[1][0].toUpperCase()}`;
    }
  
    return names[0][0].toUpperCase();
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
      toast({
        title: "Déconnexion réussie 🚀",
        variant: "success",
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      toast({
        title: "Erreur lors de la déconnexion",
        description: message,
        variant: "error",
      });
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.name} alt={user?.name} />
                <AvatarFallback className="rounded-lg">{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.name} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <Link href={"/dashboard/profil"}>
              <DropdownMenuItem className="cursor-pointer">
                    <UserRound />
                    Mon compte
              </DropdownMenuItem>
            </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="text-destructive"/>
              <span> Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
