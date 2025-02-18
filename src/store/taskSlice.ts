import { create } from "zustand";

import { persist } from "zustand/middleware";
import { ID, db, TaskCollectionId, databaseId, Query} from "@/src/lib/appwrite";
import { TaskState, Task } from "@/src/models/task";
import { mapTaskInformation } from "../utils/mappingTaskInformations";

export const useTaskStore = create(
  persist<TaskState>(
    (set) => ({
      tasks: [],
      fetchTasks: async (userId: string) => {
        try {
          const result = await db.listDocuments(databaseId, TaskCollectionId, [Query.equal("user_id", userId)]);
          const tasks = result.documents.map((task) => mapTaskInformation(task));
          set({ tasks });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          throw new Error(message);
        }
      },
      addTask: async (task, userId) => {
        try {
          const documentId = ID.unique();
          const newTask: Task = {
            ...task,
            user_id: userId,
            completed: false,
          };
          await db.createDocument(databaseId, TaskCollectionId,documentId, newTask);
          const taskWithId = {...newTask, id:documentId};
          set((state) => ({ tasks: [...state.tasks, taskWithId] }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          throw new Error(message);
        }
      },
      toggleTask: async (taskId) => {
        try {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          }));
    
          const updatedTask = useTaskStore.getState().tasks.find((task) => task.id === taskId);
          if (updatedTask) {
            await db.updateDocument(
              databaseId,
              TaskCollectionId,
              taskId,
              { completed: updatedTask.completed }
            );
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          throw new Error(message);
        }
      },
    
      updateTask: async (task, updates) => {
        try {
          await db.updateDocument(
            databaseId,
            TaskCollectionId,
            task.id??"",
            updates
          );
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === task.id ? { ...t, ...updates } : t
            ),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          throw new Error(message);
        }
      },
    
      deleteTask: async (taskId) => {
        try {
          await db.deleteDocument(databaseId, TaskCollectionId, taskId);
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          throw new Error(message);
        }
      },
    }),
    {
      name: "task-storage"
    }
  )
);


export const selectTasks = (state: TaskState) => state.tasks;