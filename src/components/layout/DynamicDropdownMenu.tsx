"use client";

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { EllipsisVertical, CheckSquare, List, SlidersHorizontal, Unplug, EyeOff, CaptionsOff, Columns4, AlignVerticalSpaceAround, Grid2X2 } from "lucide-react";
import React from "react";
import { usePrefUserStore } from "@/src/store/prefUserSlice";
import { TbGrid4X4 } from "react-icons/tb";

type MenuItem = {
  label: string;
  onClick: () => void;
  icon: React.ReactElement;
};

const DynamicDropdownMenu: React.FC = () => {
  const displayFinishedTasks = usePrefUserStore((state) => state.tasklist_DisplayFinishedTasks);
  const displayDetailsTasks = usePrefUserStore((state) => state.tasklist_DisplayDetailsTasks);
  const matrice_DisplayFinishedTasks = usePrefUserStore((state) => state.matrice_DisplayFinishedTasks);
  const calendar_DisplayFinishedTasks = usePrefUserStore((state) => state.calendar_DisplayFinishedTasks);
  const calendar_ViewMode = usePrefUserStore((state) => state.calendar_ViewMode);
  const { setCalendarViewMode, setTasklistDisplayFinishedTasks, setTasklistDisplayDetailsTasks, setMatriceDisplayFinishedTasks, setCalendarDisplayFinishedTasks } = usePrefUserStore.getState();
  const pathname = usePathname();

  const menuItems: Record<string, MenuItem[]> = {
    "/dashboard": [
      { label: `${displayFinishedTasks ? "Masquer" : "Afficher"} Terminées`, onClick: () => setTasklistDisplayFinishedTasks(displayFinishedTasks), icon: displayFinishedTasks ? <EyeOff size={16} /> : <CheckSquare size={16} /> },
      { label: `${displayDetailsTasks ? "Masquer" : "Afficher"} Details`, onClick: () => setTasklistDisplayDetailsTasks(displayDetailsTasks), icon: displayDetailsTasks ? <CaptionsOff size={16} /> : <List size={16} /> },
      { label: "Collaborer", onClick: () => console.log("Collaborer clicked"), icon: <Unplug size={16} /> },
    ],
    "/dashboard/matrice": [
      { label: `${matrice_DisplayFinishedTasks ? "Masquer" : "Afficher"} Terminées`, onClick: () => setMatriceDisplayFinishedTasks(matrice_DisplayFinishedTasks), icon: matrice_DisplayFinishedTasks ? <EyeOff size={16} /> : <CheckSquare size={16}/> },        
    ],
    "/dashboard/sessions": [
      { label: "Paramètres pour rester concentré.e", onClick: () => console.log("Afficher Terminées clicked"), icon: <SlidersHorizontal size={16} /> },        
    ],
    "/dashboard/calendrier": [
      { label: "Afficher par jour", onClick: () => setCalendarViewMode("jour"), icon: <AlignVerticalSpaceAround color={calendar_ViewMode === "jour" ? "#00B87C" : "currentColor"} size={16} /> },
      { label: "Afficher par semaine", onClick: () => setCalendarViewMode("semaine"), icon: <Columns4 color={calendar_ViewMode === "semaine" ? "#00B87C" : "currentColor"} size={16} /> },
      { label: "Afficher par mois", onClick: () => setCalendarViewMode("mois"), icon: <Grid2X2 color={calendar_ViewMode === "mois" ? "#00B87C" : "currentColor"} size={16} /> },
      { label: `${calendar_DisplayFinishedTasks ? "Masquer" : "Afficher"} Terminées`, onClick: () => setCalendarDisplayFinishedTasks(calendar_DisplayFinishedTasks), icon: calendar_DisplayFinishedTasks ? <EyeOff size={16} /> : <CheckSquare size={16} /> },
    ],
  };
  
  if(pathname === "/dashboard/parametres" || pathname === "/dashboard/profil" || pathname === "/dashboard/rechercher" ) return null;

  const items: MenuItem[] = menuItems[pathname];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick} className="flex items-center cursor-pointer">
            {item.icon}
            <span className="truncate max-w-[150px]">{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DynamicDropdownMenu;
