"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
} from "lucide-react"

import { FaCalendarDays, FaCircleDot, FaSquareCheck } from "react-icons/fa6";
import { BsGridFill } from "react-icons/bs";
import { FaSearch} from "react-icons/fa";

import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/src/components/ui/sidebar"
import { selectUser, useAuthStore } from "../../store/authSlice"
import Image from 'next/image';
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { useIsMobile } from "@/src/hooks/use-mobile";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Mes tâches",
      url: "/dashboard",
      icon: FaSquareCheck,
      items: [],
    },
    {
      title: "Calendrier",
      url: "/dashboard/calendrier",
      icon: FaCalendarDays,
      items: [],
    },
    {
      title: "Sessions de travail",
      url: "#",
      icon: FaCircleDot,
      items: [
        {
          title: "Pomodoro",
          url: "/dashboard/sessions",
        },
      ],
    },
    {
      title: "Matrice d'Eisenhower",
      url: "/dashboard/matrice",
      icon: BsGridFill,
      items: [],
    },
    {
      title: "Rechercher",
      url: "/dashboard/rechercher",
      icon: FaSearch,
      items: [],
    }
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore(selectUser);
  const isMobile = useIsMobile();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Image
                        loading="lazy"
                        src="/assets/img/Logo.png" 
                        width={100}
                        height={90} 
                        alt="Logo SimplyDone App"                  
                      />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">SimplyDone App</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {!isMobile && <NavMain items={data.navMain} />}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <Button className="mb-5" variant="secondary"><Plus /> Ajouter une catégorie</Button> */}
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
