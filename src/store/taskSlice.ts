import { create } from "zustand";

import { persist } from "zustand/middleware";
import { ID, db, TaskCollectionId, databaseId, Query, storage, TasksImgBucketId} from "@/src/lib/appwrite";
import { TaskState, Task } from "@/src/models/task";
import { mapTaskInformation } from "../utils/mapTaskInformations";
import { toast } from "../hooks/use-toast";
import { useAuthStore } from "./authSlice";

export const useTaskStore = create(
  persist<TaskState>(
    (set) => ({
      tasks: [],
      searchTaskResults: [],
      fetchTasks: async (userId: string) => {
        try {
          const result = await db.listDocuments(databaseId, TaskCollectionId, [Query.equal("user_id", userId)]);
          const tasks = result.documents.map((task) => mapTaskInformation(task));
          set({ tasks });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          toast({
            title: message,
            variant: "error",
          });
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
          toast({
            title: message,
            variant: "error",
          });
        }
      },
      toggleTask: async (taskId) => {
        try {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
            searchTaskResults: state.searchTaskResults.map((task) =>
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
          toast({
            title: message,
            variant: "error",
          });
        }
      },
    
      updateTask: async (task, updates) => {
        try {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === task.id ? { ...t, ...updates } : t
            ),
            searchTaskResults: state.searchTaskResults.map((t) =>
              t.id === task.id ? { ...t, ...updates } : t
            ),
          }));
          
          await db.updateDocument(
            databaseId,
            TaskCollectionId,
            task.id??"",
            updates
          );

        } catch (error) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          toast({
            title: message,
            variant: "error",
          });
        }
      },
    
      deleteTask: async (taskId, imageID) => {
        try {
          if(imageID) {
            await storage.deleteFile(TasksImgBucketId, imageID);
          }
          await db.deleteDocument(databaseId, TaskCollectionId, taskId);
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          toast({
            title: message,
            variant: "error",
          });
        }
      },
      searchTasks: async (searchValue) => {
        try {
            const userId = useAuthStore.getState().user;
            if (!userId) {
              throw new Error("User ID is null. Please ensure the user is authenticated.");
            }
            const result = await db.listDocuments(databaseId, TaskCollectionId, [
              Query.or([
                Query.search("title", searchValue),
                Query.search("description", searchValue),
              ]),
              Query.equal("user_id", userId.$id),
            ]);
          const searchTaskResults = result.documents.map((task) => mapTaskInformation(task));
          set({ searchTaskResults });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
            toast({
              title: message,
              variant: "error",
            });
        }
      },
    }),
    {
      name: "task-storage"
    }
  )
);


export const selectTasks = (state: TaskState) => state.tasks;
export const selectSearchtasks = (state: TaskState) => state.searchTaskResults;