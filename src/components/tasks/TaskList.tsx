"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore, selectTasks } from "@/src/store/taskSlice";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { CheckCircle, Circle, MoreVertical, Trash, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { SkeletonTask } from "../loaderSkeletons/SkeletonTask";
import { Task } from "@/src/models/task";
import { toast } from "@/src/hooks/use-toast";
import Image from "next/image";

export function TaskList() {
  const { fetchTasks, toggleTask, deleteTask } = useTaskStore();
  const tasks = useTaskStore(selectTasks);
  const user = useAuthStore(selectUser);

  const [isPending, startTransition] = useTransition();
  const [longPressId, setLongPressId] = useState<string | null>(null);

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
  const handleLongPress = (taskId: string) => {
    setLongPressId(taskId);
    setTimeout(() => {
      setLongPressId(null);
    }, 2000);
  };
  
  if(isPending) return <div className="mt-8"><SkeletonTask/></div>;

  return (
    <div className="grid gap-4 mt-8">
      {Array.isArray(tasks) && tasks.length > 0 ? (
      <AnimatePresence>
        {tasks.map((task: Task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative flex items-center gap-4 p-4 rounded-lg shadow-lg"
            onTouchStart={() => handleLongPress(task.id??"")}
            style={{ backgroundColor: task.color || "#f3f4f6" }}
          >
            <button
              onClick={() => startTransition(() => toggleTask(task.id??""))}
              
            >
              {task.completed ? (
                <CheckCircle size={24} className="text-green-400" />
              ) : (
                <Circle size={24} className="text-white" />
              )}
            </button>

            <div className="flex-1">
              <h3 className={`font-semibold text-white ${task.completed ? "line-through " : ""}`}>
                {task.title}
              </h3>
              {task.description && <p className="text-sm text-gray-400">{task.description}</p>}
            </div>

            {task.image_url && (
              <Image 
                  src={task.image_url} 
                  alt="Task" 
                  className="w-12 h-12 rounded-md object-cover"
                  width={100}
                  height={100}
                />
            )}

            {longPressId === task.id && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                onClick={() => startTransition(() => deleteTask(task.id??""))}
              >
                <Trash size={16} />
              </motion.button>
            )}

            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
                    <MoreVertical size={20} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => console.log("Modifier", task.id)}>
                    <Edit size={16} className="mr-2" /> Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => startTransition(() => deleteTask(task.id??""))}
                    className="text-red-500"
                  >
                    <Trash size={16} className="mr-2" /> Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      ) : (
        <p className="text-gray-500 text-center mt-32">Aucune tâche pour le moment.</p>
      )}
    </div>
  );
}
