"use client";

import { useEffect, useState, useTransition } from "react";
import { useTaskStore, selectTasks } from "@/src/store/taskSlice";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { SkeletonTask } from "../loaderSkeletons/SkeletonTask";
import { toast } from "@/src/hooks/use-toast";
import { TaskListItems } from "./TaskListItems";
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
import type { TaskList } from "@/src/models/taskList";
import { UseTaskListStore } from "@/src/store/taskListSlice";

export function TaskList() {
  const { fetchTasks, toggleTask, listenToTasks } = useTaskStore();
  const { markUserAsSeenIntro } = useAuthStore();
  const tasks = useTaskStore(selectTasks);
  const user = useAuthStore(selectUser);
  const hasSeenIntro = user?.hasSeenIntro ?? false;
  const { tasklist_DisplayFinishedTasks } = usePrefUserStore();
  const [showGuide, setShowGuide] = useState(false);
  const taskLists = UseTaskListStore((state) => state.taskLists);

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
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Une erreur inconnue est survenue";
      toast({
        title: message,
        variant: "error",
      });
    }
  }, [fetchTasks, user]);

  useEffect(() => {
    if (!hasSeenIntro) {
      setShowGuide(true);
    }
  }, []);

  useEffect(() => {
    listenToTasks();
  }, [listenToTasks]);

  if (isPending) return <div className="mt-4"><SkeletonTask /></div>;

  const uniqueTasks = Array.from(
    new Map(tasks.map((task) => [task.id, task])).values()
  );

  // Séparation actives / terminées
  const activeTasks = uniqueTasks.filter((task) => !task.completed);
  const completedTasks = uniqueTasks.filter((task) => task.completed);

  // Séparation par catégorie
  const categorizedActive = activeTasks.filter((t) => !!t.taskList);
  const uncategorizedActive = activeTasks.filter((t) => !t.taskList);
  const categorizedCompleted = completedTasks.filter((t) => !!t.taskList);
  const uncategorizedCompleted = completedTasks.filter((t) => !t.taskList);

  const priorityMap: { [key: string]: number } = {
    high: 3,
    medium: 2,
    low: 1,
    none: 0,
  };

  const sortByPriority = (arr: typeof activeTasks) =>
    arr.sort(
      (a, b) => priorityMap[b.priority ?? "none"] - priorityMap[a.priority ?? "none"]
    );

  sortByPriority(categorizedActive);
  sortByPriority(uncategorizedActive);
  sortByPriority(categorizedCompleted);
  sortByPriority(uncategorizedCompleted);

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
      description:
        "Vous êtes prêt à utiliser SimplyDone. N'hésitez pas à revenir au guide dans les paramètres si besoin.",
      variant: "success",
    });
    markUserAsSeenIntro(true);
    setShowGuide(false);
  };

  const renderTasks = (
    tasks: typeof activeTasks,
    showAll: boolean,
    setShowAll: (v: boolean) => void,
    limit: number
  ) => (
    <>
      {(showAll ? tasks : tasks.slice(0, limit)).map((task, index) => (
        <Draggable key={task.id} draggableId={task.id!} index={index}>
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
      {tasks.length > limit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 text-sm mt-2 opacity-95 flex"
        >
          {showAll ? (
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
  );

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-2.5 mt-4">
          {tasks.length > 0 ? (
            <>
              {/* Actives */}
              <Droppable droppableId="active">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {activeTasks.length > 0 ? (
                      <>
                        {/* Catégorisées */}
                        {categorizedActive.length > 0 &&
                          taskLists.map((list: TaskList) => {
                            const listTasks = categorizedActive.filter(
                              (t) => t.taskList === list.id
                            );
                            if (listTasks.length === 0) return null;
                            return (
                              <div key={list.id} className="mt-4 mb-2">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: list.color }}
                                  />
                                  {list.title}
                                </h2>
                                {renderTasks(listTasks, showAllActive, setShowAllActive, 3)}
                              </div>
                            );
                          })}

                        {/* Autres si mixte */}
                        {categorizedActive.length > 0 &&
                          uncategorizedActive.length > 0 && (
                            <div className="mt-4 mb-2">
                              <h2 className="font-semibold text-lg text-gray-400">
                                Autres
                              </h2>
                              {renderTasks(
                                uncategorizedActive,
                                showAllActive,
                                setShowAllActive,
                                5
                              )}
                            </div>
                          )}

                        {/* Sinon juste les non catégorisées */}
                        {categorizedActive.length === 0 &&
                          uncategorizedActive.length > 0 &&
                          renderTasks(
                            uncategorizedActive,
                            showAllActive,
                            setShowAllActive,
                            5
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

              {/* Terminées */}
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

                      {/* Catégorisées */}
                      {categorizedCompleted.length > 0 &&
                        taskLists.map((list: TaskList) => {
                          const listTasks = categorizedCompleted.filter(
                            (t) => t.taskList === list.id
                          );
                          if (listTasks.length === 0) return null;
                          return (
                            <div key={list.id} className="mt-2">
                              <h3 className="font-medium flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: list.color }}
                                />
                                {list.title}
                              </h3>
                              {renderTasks(
                                listTasks,
                                showAllCompleted,
                                setShowAllCompleted,
                                3
                              )}
                            </div>
                          );
                        })}

                      {/* Autres si mixte */}
                      {categorizedCompleted.length > 0 &&
                        uncategorizedCompleted.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-medium text-gray-500">Autres</h3>
                            {renderTasks(
                              uncategorizedCompleted,
                              showAllCompleted,
                              setShowAllCompleted,
                              3
                            )}
                          </div>
                        )}

                      {/* Sinon juste non catégorisées */}
                      {categorizedCompleted.length === 0 &&
                        uncategorizedCompleted.length > 0 &&
                        renderTasks(
                          uncategorizedCompleted,
                          showAllCompleted,
                          setShowAllCompleted,
                          3
                        )}

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

      <SubscribeToNotificationDialog />
      <WelcomeGuide open={showGuide} onFinish={onFinishGuide} />
    </>
  );
}
