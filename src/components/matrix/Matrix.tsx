"use client";

import React from "react";
import { selectTasks, useTaskStore } from "@/src/store/taskSlice";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { AlertTriangle, CalendarCheck, Clock, ZapOff } from "lucide-react";
import { TaskListItems } from "../tasks/TaskListItems";
import { usePrefUserStore } from "@/src/store/prefUserSlice";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

export default function MatrixLayout() {
  let tasks = useTaskStore(selectTasks);
  const { matrice_DisplayFinishedTasks } = usePrefUserStore();

  if (!matrice_DisplayFinishedTasks) {
    tasks = tasks.filter(task => !task.completed);
  }

  const quadrants = {
    "urgent-important": {
      title: "Urgent et important",
      color: "text-red-500",
      borderColor: "border-red-500",
      icon: <AlertTriangle className="mr-2 h-5 w-4 md:w-5" />,
      tasks: tasks
        .filter(task => task.priority === "high")
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    },
    "not-urgent-important": {
      title: "Non urgent mais important",
      color: "text-yellow-500",
      borderColor: "border-yellow-500",
      icon: <CalendarCheck className="mr-2 h-5 w-4 md:w-5" />,
      tasks: tasks
        .filter(task => task.priority === "medium")
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    },
    "urgent-not-important": {
      title: "Urgent mais non important",
      icon: <Clock className="mr-2 h-5 w-4 md:w-5" />,
      color: "text-blue-500",
      borderColor: "border-blue-500",
      tasks: tasks
        .filter(task => task.priority === "low")
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    },
    "not-urgent-not-important": {
      title: "Pas urgent et non important",
      color: "text-green-500",
      borderColor: "border-green-500",
      icon: <ZapOff className="mr-2 h-5 w-4 md:w-5" />,
      tasks: tasks
        .filter(task => task.priority === "none")
        .sort((a, b) => Number(a.completed) - Number(b.completed)),
    },
  };

  if (tasks.length === 0) return null;

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    let newPriority:  "none" | "low" | "medium" | "high" | undefined;
    switch (destination.droppableId) {
      case "urgent-important":
        newPriority = "high";
        break;
      case "not-urgent-important":
        newPriority = "medium";
        break;
      case "urgent-not-important":
        newPriority = "low";
        break;
      case "not-urgent-not-important":
        newPriority = "none";
        break;
      default:
        return;
    }

    useTaskStore.getState().updateTask(draggableId, { priority: newPriority });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid h-[80vh] grid-cols-2 grid-rows-2 gap-2">
        {Object.entries(quadrants).map(([key, quadrant]) => (
          <Droppable droppableId={key} key={key}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  relative flex flex-col rounded-lg bg-muted/50 p-1.5 shadow-sm h-full overflow-hidden 
                  ${snapshot.isDraggingOver ? `border ${quadrant.borderColor}` : ""}
                `}
              >
                <h2
                  className={`mb-4 flex items-center text-[10px] w-full md:text-lg font-semibold ${quadrant.color}`}
                >
                  {quadrant.icon}
                  {quadrant.title}
                </h2>

                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {quadrant.tasks
                      .filter((task) => task.id !== undefined)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id!} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskListItems tasks={[task]} isMatrix={true} />
                          </div>
                        )}
                       </Draggable>
                    ))}
                    {quadrant.tasks.length === 0 && <div className="text-center text-muted-foreground opacity-60 text-xs md:text-lg my-20">
                      Aucune tâche à afficher
                    </div>}
                  </div>
                  {provided.placeholder}
                </ScrollArea>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

