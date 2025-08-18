"use client"

import * as React from "react"
import {
  ChevronRight,
  Frame,
  ListPlus,
  Map,
  PieChart,
  Settings2,
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
  useSidebar,
} from "@/src/components/ui/sidebar"
import { selectUser, useAuthStore } from "../../store/authSlice"
import Image from 'next/image';
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { useIsMobile } from "@/src/hooks/use-mobile";
import Link from "next/link";
import { Button } from "../ui/button";
import { TaskListDialog } from "../dialogs/taskList/taskListDialog";
import { TaskList } from "@/src/models/taskList";
import { NavTaskLists } from "./nav-taskList";
import { UseTaskListStore } from "@/src/store/taskListSlice";
import { toast } from "@/src/hooks/use-toast";
import { DeleteTaskListDialog } from "../dialogs/taskList/deleteTaskListDialog";
import { useTaskStore } from "@/src/store/taskSlice";

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
      url: "/dashboard/sessions",
      icon: FaCircleDot,
      items: [],
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar();
  const user = useAuthStore(selectUser);
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const {removeTaskList, fetchTaskLists} = UseTaskListStore();
  const {fetchTasks} = useTaskStore();
  const taskLists = UseTaskListStore((state) => state.taskLists);
  const [selectedTaskList, setSelectedTaskList] = React.useState<TaskList | null>(null);

  const handleEditTaskList = (taskList: TaskList) => {
    setOpen(true);
    setSelectedTaskList(taskList);
  };

  React.useEffect(() => {
      const fetchTaskList = async () => {
      try {
        if (user) {
          await fetchTaskLists(user.$id);
        }
      } catch (error:unknown) {
        const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        toast({
          title: message,
          variant: "error",
        })
      }
    };
    fetchTaskList();
  }, [fetchTaskLists, user]);

  const handleDeleteTaskList = async (taskList: TaskList) => {
    if (taskList.id) {
      await removeTaskList(taskList.id);
      if(isMobile) setOpenMobile(false);
      await fetchTasks(user?.$id ?? "");
    }
  };

  return (
<>
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
        {isMobile && <div className="border shadow-sm rounded-lg mt-4">
          <Link href="/dashboard/parametres" className="flex items-center rounded-md p-3" onClick={() => {if(isMobile) setOpenMobile(false)}}>
            <Settings2 className="text-gray-300 mr-3" />
            <span className="flex-1">Paramètres</span>
            <ChevronRight className="text-gray-400" />
          </Link>
        </div>}
        {taskLists.length > 0 && <NavTaskLists taskLists={taskLists} onEdit={handleEditTaskList} setSelectedTaskList={setSelectedTaskList} setOpenDelete={setOpenDelete} />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-4 justify-center flex">
              <Button className="mb-5" onClick={() => {setOpen(true)}}><ListPlus /> Ajouter une liste</Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <TaskListDialog 
        open={open} 
        taskList={selectedTaskList}
        onClose={() => {
          setOpen(false);
          setSelectedTaskList(null);
        }} 
    />
    <DeleteTaskListDialog 
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        taskListName={selectedTaskList?.title ?? ""}
        onConfirm={async () => {
        if (selectedTaskList) {
          await handleDeleteTaskList(selectedTaskList);
          setOpenDelete(false);
          setSelectedTaskList(null);
        }
      }}
    />
</>
  )
}
