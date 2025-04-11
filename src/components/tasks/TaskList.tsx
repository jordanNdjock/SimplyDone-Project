"use client";

import { useEffect, useTransition } from "react";
import { useTaskStore, selectTasks } from "@/src/store/taskSlice";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { SkeletonTask } from "../loaderSkeletons/SkeletonTask";
import { toast } from "@/src/hooks/use-toast";
import { TaskListItems } from './TaskListItems';
import { usePrefUserStore } from "@/src/store/prefUserSlice";
import OneSignal from "react-onesignal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export function TaskList() {
  const { fetchTasks, toggleTask, listenToTasks } = useTaskStore();
  const tasks = useTaskStore(selectTasks);
  const user = useAuthStore(selectUser);
  const { tasklist_DisplayFinishedTasks } = usePrefUserStore();

  const [isPending, startTransition] = useTransition();


  useEffect(() => {
    if (typeof window !== "undefined" && !window.__ONE_SIGNAL_INITIALIZED__) {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
        allowNative: true,
        notifyButton: { enable: true },
        allowLocalhostAsSecureOrigin: true,
      });
      window.__ONE_SIGNAL_INITIALIZED__ = true;
    }
    OneSignal.Slidedown.promptPush();
  }, []);

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

  useEffect(() => {
    listenToTasks()
  },[listenToTasks]);

  if(isPending) return <div className="mt-4"><SkeletonTask/></div>;

  
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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const draggedTask = tasks.find((t) => t.id === draggableId);
    if (!draggedTask) return;

    if (draggedTask.id) {
      toggleTask(draggedTask.id);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-2.5 mt-4">
        {tasks.length > 0 ? (
          <>
            <Droppable droppableId="active">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {activeTasks.length > 0 ? (
                    activeTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id!}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="gap-2.5 mt-2"
                          >
                            <TaskListItems tasks={[task]} />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center mt-4">
                      Aucune tâche active pour le moment.
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {completedTasks.length > 0 && tasklist_DisplayFinishedTasks && (
              <Droppable droppableId="completed">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="mt-6 opacity-60 space-y-2"
                  >
                    <h2 className="text-lg md:text-xl font-bold text-gray-500 mb-2">
                      Terminées
                    </h2>
                    {completedTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id!}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskListItems tasks={[task]} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center mt-32">
            Aucune tâche pour le moment.
          </p>
        )}
      </div>
    </DragDropContext>
  );
}
