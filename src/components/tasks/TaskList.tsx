"use client";

import { useEffect, useState, useTransition } from "react";
import { useTaskStore, selectTasks } from "@/src/store/taskSlice";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { SkeletonTask } from "../loaderSkeletons/SkeletonTask";
import { toast } from "@/src/hooks/use-toast";
import { TaskListItems } from './TaskListItems';
import { usePrefUserStore } from "@/src/store/prefUserSlice";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import SubscribeToNotificationDialog from "../dialogs/notifs/SubscribeToNotificationDialog";
import WelcomeGuide from "../dialogs/welcomeGuide/WelcomeGuide";
import OneSignal from "react-onesignal";

export function TaskList() {
  const { fetchTasks, toggleTask, listenToTasks } = useTaskStore();
  const { markUserAsSeenIntro } = useAuthStore();
  const tasks = useTaskStore(selectTasks);
  const user = useAuthStore(selectUser);
  const hasSeenIntro = user?.hasSeenIntro ?? false;
  const { tasklist_DisplayFinishedTasks } = usePrefUserStore();
  const [showGuide, setShowGuide] = useState(false)

  const [showAllActive, setShowAllActive] = useState(false);
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window !== "undefined" && !window.__ONE_SIGNAL_INITIALIZED__) {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
        serviceWorkerPath: "/OneSignalSDKWorker.js",
        allowNative: true,
        notifyButton: { enable: true },
        allowLocalhostAsSecureOrigin: true,
      });
      window.__ONE_SIGNAL_INITIALIZED__ = true;
    }
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
    if (!hasSeenIntro) {
      setShowGuide(true);
    }
  }, [])

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

  const onFinishGuide = () => {
    toast({
      title: "Bravo vous avez terminé le guide 🎉",
      description: "Vous êtes prêt à utiliser SimplyDone. N'hésitez pas à revenir au guide dans les paramètres si besoin.",
      variant: "success"
    })
    markUserAsSeenIntro(true);
    setShowGuide(false);
  }

  return (
  <>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-2.5 mt-4">
        {tasks.length > 0 ? (
          <>
            <Droppable droppableId="active">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {activeTasks.length > 0 ? (
                    <>
                    {(showAllActive ? activeTasks : activeTasks.slice(0, 5)).map((task, index) => (
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
                            <TaskListItems key={task.id} tasks={[task]} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {activeTasks.length > 5 && (
                      <button
                        onClick={() => setShowAllActive(!showAllActive)}
                        className="text-blue-600 text-sm mt-2 opacity-95 flex"
                      >
                        {showAllActive ? (
                            <>
                              Voir moins
                              <ChevronUp className="w-5 h-5 ml-1" />
                            </>
                          ) : (
                            <>
                              Voir plus
                              <ChevronDown className="w-5 h-5 ml-1" />
                            </>
                          )}
                      </button>
                    )}
                  </>
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
              <>
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
                       {(showAllCompleted ? completedTasks : completedTasks.slice(0, 3)).map((task, index) => (
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
                              <TaskListItems key={task.id} tasks={[task]} />
                            </div>
                          )}
                        </Draggable>
                        ))}
                        {completedTasks.length > 3 && (
                          <button
                            onClick={() => setShowAllCompleted(!showAllCompleted)}
                            className="text-blue-600 text-sm opacity-100 mt-2 flex"
                          >
                            {showAllCompleted ? (
                                  <>
                                    Voir moins
                                    <ChevronUp className="w-5 h-5 ml-1" />
                                  </>
                                ) : (
                                  <>
                                    Voir plus
                                    <ChevronDown className="w-5 h-5 ml-1" />
                                  </>
                                )}
                          </button>
                        )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center mt-32">
            Aucune tâche pour le moment.
          </p>
        )}
      </div>
    </DragDropContext>
    <SubscribeToNotificationDialog />
    <WelcomeGuide open={showGuide} onFinish={onFinishGuide} />
</>
  );
}
