"use client";

import { useTransition, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle, MoreVertical, Edit, Image as ImageIcon, AlignJustify } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { DeleteTaskDialog } from "../dialogs/task/DeleteTaskDialog";
import { PriorityCircle } from "./PriorityCircle";
import { Task } from "@/src/models/task";
import { useTaskStore } from "@/src/store/taskSlice";
import { formatTaskDates } from "@/src/utils/utils";
import { TaskDialog } from "../dialogs/task/TaskDialog";
import { useIsMobile } from "@/src/hooks/use-mobile";
import { hasDatePassed } from "@/src/utils/utils";
import { usePrefUserStore } from "@/src/store/prefUserSlice";
import { cn } from "@/src/lib/utils";

interface TaskListItemsProps {
  tasks: Task[];
  isMatrix?: boolean; 
  isSearch?: boolean;
}

export function TaskListItems({ tasks, isMatrix, isSearch }: TaskListItemsProps) {
  const [longPressId, setLongPressId] = useState<string | null>(null);
  const [,startTransition] = useTransition();
  const { toggleTask, deleteTask } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const isMobile = useIsMobile();
  const { tasklist_DisplayDetailsTasks } = usePrefUserStore();
  

  const pressTimer = useRef<NodeJS.Timeout | null>(null);


  const startPressTimer = (taskId: string) => {
    pressTimer.current = setTimeout(() => {
      setLongPressId(taskId);
      navigator.vibrate(50);
    }, 1000);
  };

  const cancelPressTimer = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleTouchStart = (taskId: string) => {
    startPressTimer(taskId);
  };

  const handleTouchEnd = () => {
    cancelPressTimer();
  };

  const handleDeleteTask = (taskId: string, imageId: string) => {
    startTransition(() => deleteTask(taskId, imageId));
  } 

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  return (
<>
    <AnimatePresence>
            {tasks.map((task: Task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative flex-col items-center rounded-lg shadow-lg"
                onTouchStart={() => handleTouchStart(task.id ?? "")}
                onTouchEnd={handleTouchEnd}
                onClick={() => {
                    if (isMobile) {
                      if(longPressId){
                        setLongPressId(null);
                      }
                      handleEditTask(task);
                    }
                  }}
                style={{ backgroundColor: task.color }}
              >
              <div className={`flex gap-1.5 ${isMatrix ? "p-2" : "p-3"} items-center ${task.completed ? "opacity-45" : ""}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startTransition(() => toggleTask(task.id??""))
                }}
                >
                  {task.completed ? (
                    <CheckCircle size={isMatrix ? 14 : 20} className="text-green-400" />
                  ) : (
                    PriorityCircle({priority: task.priority, isMatrix})
                  )}
                </button>
    
                <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold text-white line-clamp-1 leading-tight",
                      isMatrix ? "text-[10px]" : "text-sm",
                      task.completed && "line-through"
                    )}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={cn(
                        isMatrix ? "text-[9px]" : "text-xs",
                        "line-clamp-1 text-gray-400",
                        !isMatrix && !tasklist_DisplayDetailsTasks && "hidden",
                      )}>
                        {task.description}
                      </p>
                    )}
                </div>
    
                {task.image_url && (
                    <Image 
                        src={task.image_url} 
                        alt="Task" 
                        className="hidden md:block w-12 h-12 rounded-md object-cover"
                        width={100}
                        height={100}
                    />
                )}

                {task.start_date && task.end_date && (
                    <div className={`flex items-center gap-2 ${isMatrix ? "text-[7px]" : "text-[10px]"} ${hasDatePassed(task.end_date) ? "text-red-300" : "text-blue-300" } font-bold`}>
                        {formatTaskDates(task.start_date, task.end_date)}
                    </div>
                )}

      
                {longPressId === task.id && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-2 right-2 p-1 rounded-full"
                  >
                    <DeleteTaskDialog taskID={task.id?? ""} imageID={task.image_id?? ""} handleDeleteTask={handleDeleteTask} />
                  </motion.button>
                )}
    
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-gray-300 text-white outline-none">
                        <MoreVertical size={20} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-blue-500 text-sm cursor-pointer" onClick={() => handleEditTask(task?? "")}>
                        <Edit size={16} className="mr-2" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <DeleteTaskDialog taskID={task.id?? ""} imageID={task.image_id?? ""} handleDeleteTask={handleDeleteTask} />
                     </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                </div>
                <div className={`flex items-center w-full ${task.image_url && "-mt-2"} -mx-3 opacity-60 gap-1 md:hidden m-0 justify-end`}>
                    {task.image_url && <ImageIcon className={`${isMatrix ? "w-2 h-2" : "w-3 h-3 -mt-1"} mb-1 text-white`}/>}
                    {!tasklist_DisplayDetailsTasks && task.description && !isMatrix && <AlignJustify className="w-3 h-3 -mt-1 mb-1 text-white" />}
                </div>
              </motion.div>
            ))}
            {!isSearch && isMatrix && tasks.length === 0 && <div className="flex flex-col items-center justify-center h-full my-20">
              <div className="text-center text-muted-foreground opacity-60 text-xs md:text-lg">
                Aucune tâche à afficher
              </div>
            </div>}
          </AnimatePresence>
          <TaskDialog 
            open={open} 
            onClose={() => {
            setOpen(false);
            setSelectedTask(null);
            }} 
            task={selectedTask}
        />
</>
  );
}
