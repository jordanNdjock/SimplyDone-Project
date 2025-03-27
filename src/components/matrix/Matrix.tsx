"use client";

import { selectTasks, useTaskStore } from "@/src/store/taskSlice"
import { ScrollArea, ScrollBar } from "@/src/components/ui/scroll-area";
import { AlertTriangle, CalendarCheck, Clock, ZapOff } from "lucide-react";
import { TaskListItems } from "../tasks/TaskListItems";
import { usePrefUserStore } from "@/src/store/prefUserSlice";

export default function MatrixLayout() {
    let tasks = useTaskStore(selectTasks);
    const { matrice_DisplayFinishedTasks } = usePrefUserStore();

    if (!matrice_DisplayFinishedTasks) {
      tasks = tasks.filter(task => !task.completed);
    }

    const quadrants = {
      'urgent-important': {
        title: "Urgent et important",
        color: "text-red-500",
        icon: <AlertTriangle className="mr-2 h-5 w-4 md:w-5" />,
        tasks: tasks
        .filter(task => task.priority === 'high')
        .sort((a, b) => Number(a.completed) - Number(b.completed))
      },
      'not-urgent-important': {
        title: "Non urgent mais important",
        color: "text-yellow-500",
        icon: <CalendarCheck className="mr-2 h-5 w-4 md:w-5" />,
        tasks: tasks
        .filter(task => task.priority === 'medium')
        .sort((a, b) => Number(a.completed) - Number(b.completed))
      },
      'urgent-not-important': {
        title: "Urgent mais non important",
        icon: <Clock className="mr-2 h-5 w-4 md:w-5" />,
        color: "text-blue-500",
        tasks: tasks
        .filter(task => task.priority === 'low')
        .sort((a, b) => Number(a.completed) - Number(b.completed))
      },
      'not-urgent-not-important': {
        title: "Pas urgent et non important",
        color: "text-green-500",
        icon: <ZapOff className="mr-2 h-5 w-4 md:w-5" />,
        tasks: tasks
        .filter(task => task.priority === 'none')
        .sort((a, b) => Number(a.completed) - Number(b.completed))
      }
    }
  
  if(tasks.length === 0) return null;

  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
        {Object.entries(quadrants).map(([key, quadrant]) => (
          <div 
            key={key}
            className="relative flex flex-col rounded-lg bg-muted/50 p-1 shadow-sm h-70"
          >
            <h2 className={`mb-4 flex items-center text-[10px] w-full md:text-lg font-semibold ${quadrant.color}`}>
              {quadrant.icon}
              {quadrant.title}
            </h2>
            
            <ScrollArea className="flex-1 overflow-auto">
              <div className="space-y-2">
                <TaskListItems 
                  tasks={quadrant.tasks}
                  isMatrix={true}
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ))}
      </div>
  )
}