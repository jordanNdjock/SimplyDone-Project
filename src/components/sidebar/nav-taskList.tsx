"use client";

import { Pencil, Trash } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/src/components/ui/sidebar";
import { TaskList } from "@/src/models/taskList";
import { useMediaQuery } from "@/src/hooks/use-media-query";


interface NavTaskListsProps {
  taskLists: TaskList[];
  onEdit: (taskList: TaskList) => void;
  onDelete: (taskList: TaskList) => void;
  setSelectedTaskList: (taskList: TaskList) => void;
  setOpenDelete: (open: boolean) => void;

}

export function NavTaskLists({ taskLists, onEdit, onDelete, setSelectedTaskList, setOpenDelete }: NavTaskListsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Mes Listes</SidebarGroupLabel>
      <SidebarMenu>
        {taskLists.map((list) => (
          <SidebarMenuItem key={list.id}>
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton tooltip={list.title} className="flex items-center gap-2 w-full">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: list.color }}
                    ></div>
                    <span className="truncate">{list.title}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(list)}>
                    <Pencil className="w-4 h-4 mr-2" /> Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                        setSelectedTaskList(list);
                        setOpenDelete(true);
                    }}
                    className="text-red-500"
                  >
                    <Trash className="w-4 h-4 mr-2" /> Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center justify-between w-full">
                <SidebarMenuButton tooltip={list.title} className="flex items-center gap-2 flex-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: list.color }}
                  ></div>
                  <span className="truncate">{list.title}</span>
                </SidebarMenuButton>
                <div className="flex gap-1 ml-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(list)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                    setSelectedTaskList(list);
                    setOpenDelete(true);
                  }}>
                    <Trash className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
