"use client";

import { useEffect, useTransition } from "react";
import { useTaskStore, selectTasks } from "@/src/store/taskSlice";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { SkeletonTask } from "../loaderSkeletons/SkeletonTask";
import { toast } from "@/src/hooks/use-toast";
import { TaskListItems } from './TaskListItems';

export function TaskList() {
  const { fetchTasks } = useTaskStore();
  const tasks = useTaskStore(selectTasks);
  const user = useAuthStore(selectUser);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try {
      if (user) {
        startTransition(() => fetchTasks(user.$id));
      }
    } catch (error:unknown) {
      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      toast({
        title: message,
        variant: "error",
      })
    }
  }, [fetchTasks, user]);


  if(isPending) return <div className="mt-8"><SkeletonTask/></div>;

  
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const priorityMap: { [key: string]: number } = {
    high: 3,
    medium: 2,
    low: 1,
    none: 0,
  };

  activeTasks.sort((a, b) => (priorityMap[b.priority ?? 'none'] - priorityMap[a.priority ?? 'none']));
  completedTasks.sort((a, b) => (priorityMap[b.priority ?? 'none'] - priorityMap[a.priority ?? 'none']));

  return (
    <div className="grid gap-4 mt-4">
      {Array.isArray(tasks) && tasks.length > 0 ? (
    <>
      <TaskListItems tasks={activeTasks} />
      
      {completedTasks.length > 0 && (
        <div className="mt-12 opacity-60 space-y-4">
          <h2 className="text-lg md:text-2xl font-bold text-gray-500 mb-4">Terminées</h2>
          <TaskListItems tasks={completedTasks} />
        </div>
      )}
    </>
      ) : (
        <p className="text-gray-500 text-center mt-32">Aucune tâche pour le moment.</p>
      )}
    </div>
  );
}
