"use client";

import { useTransition, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle, MoreVertical, Edit, Image as ImageIcon } from "lucide-react";
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

interface TaskListItemsProps {
  tasks: Task[];
}

export function TaskListItems({ tasks }: TaskListItemsProps) {
  const [longPressId, setLongPressId] = useState<string | null>(null);
  const [,startTransition] = useTransition();
  const { toggleTask, deleteTask } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const isMobile = useIsMobile();

  const pressTimer = useRef<NodeJS.Timeout | null>(null);


  const startPressTimer = (taskId: string) => {
    pressTimer.current = setTimeout(() => {
      setLongPressId(taskId);
      navigator.vibrate(50);
    }, 500);
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
              <div className="flex gap-4 p-4 items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startTransition(() => toggleTask(task.id??""))
                }}
                >
                  {task.completed ? (
                    <CheckCircle size={24} className="text-green-400" />
                  ) : (
                    PriorityCircle({priority: task.priority})
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
                        className="hidden md:block w-12 h-12 rounded-md object-cover"
                        width={100}
                        height={100}
                    />
                )}

                {task.start_date && task.end_date && (
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
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
                      <DropdownMenuItem className="text-blue-500 text-sm" onClick={() => handleEditTask(task?? "")}>
                        <Edit size={16} className="mr-2" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <DeleteTaskDialog taskID={task.id?? ""} imageID={task.image_id?? ""} handleDeleteTask={handleDeleteTask} />
                     </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                </div>
                <div className="flex items-center w-full -mx-4 opacity-60 gap-2 md:hidden m-0 justify-end">
                    {task.image_url && <ImageIcon className="w-4 h-4 mb-1"/>}
                    {task.is_repeat && <ImageIcon className="w-4 h-4 mb-1"/>}
                </div>
              </motion.div>
            ))}
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
