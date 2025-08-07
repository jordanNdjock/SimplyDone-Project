import { create } from "zustand";

import { persist } from "zustand/middleware";
import { ID, db, TaskCollectionId, databaseId, Query, storage, TasksImgBucketId, client} from "@/src/lib/appwrite";
import { TaskState, Task } from "@/src/models/task";
import { mapTaskInformation } from "../utils/mapTaskInformations";
import { toast } from "../hooks/use-toast";
import { useAuthStore } from "./authSlice";

export const useTaskStore = create(
  persist<TaskState>(
    (set, get) => ({
      tasks: [],
      searchTaskResults: [],
      searchTaskQuery: [],
      fetchTasks: async (userId: string) => {
        try {
          const result = await db.listDocuments(databaseId, TaskCollectionId, [Query.equal("user_id", userId), Query.orderDesc("$createdAt"), Query.limit(100) ]);
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
          const duplicateTask = get().tasks.find(
            (t) => t.title === task.title && t.user_id === userId
          );
          if (duplicateTask) {
            toast({ title: "Tâche déjà existante", variant: "error" });
          }else{
            const documentId = ID.unique();
            const newTask: Task = {
              ...task,
              user_id: userId,
              completed: false,
            };
        
            await db.createDocument(databaseId, TaskCollectionId, documentId, newTask);
            const taskWithId = { ...newTask, id: documentId };
        
            set((state) => ({ tasks: [taskWithId, ...state.tasks] }));
          }
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Une erreur inconnue est survenue";
          toast({ title: message, variant: "error" });
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
    
      updateTask: async (taskId, updates) => {
        try {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === taskId ? { ...t, ...updates } : t
            ),
            searchTaskResults: state.searchTaskResults.map((t) =>
              t.id === taskId ? { ...t, ...updates } : t
            ),
          }));
          await db.updateDocument(
            databaseId,
            TaskCollectionId,
            taskId ??"",
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
            searchTaskResults: state.searchTaskResults.filter((task) => task.id !== taskId),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          toast({
            title: message,
            variant: "error",
          });
        }
      },
      setSearchTaskQuery: (searchValue) => {
        set({ searchTaskQuery: [...searchValue] });
      },
      searchTasks: async (searchValue) => {
        try {
            const userId = useAuthStore.getState().user;
            if (!userId) {
              throw new Error("User ID is null. Please ensure the user is authenticated.");
            }

            if(searchValue?.trim() !== "" && searchValue && !get().searchTaskQuery.some(val => val.toLowerCase() === searchValue.trim().toLowerCase())
              ) {
              set({ searchTaskQuery: [...get().searchTaskQuery, searchValue] });
            }
            const result = await db.listDocuments(databaseId, TaskCollectionId, [
              Query.or([
                Query.search("title", searchValue),
                Query.search("description", searchValue),
              ]),
              Query.equal("user_id", userId.$id),
              Query.limit(100)
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
      listenToTasks: () => {
        if (typeof window === "undefined") return;
        const subscription = client.subscribe(
          `databases.${databaseId}.collections.${TaskCollectionId}.documents`,
          async (response) => {
            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
              const newTask = mapTaskInformation(response.payload);
              set((state) => {
                const exists = state.tasks.some((task) => task.id === newTask.id);
                if (exists) {
                  return {};
                }
                return { tasks: [newTask, ...state.tasks] };
              });
            }            
            if (response.events.includes("databases.*.collections.*.documents.*.update")) {
              const updatedTask = mapTaskInformation(response.payload);
              set((state) => ({
                tasks: state.tasks.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                ),
                searchTaskResults: state.searchTaskResults.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                ),
              }));
            }
            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
              const deletedTaskId = (response.payload as { $id: string }).$id;
              set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== deletedTaskId),
                searchTaskResults: state.searchTaskResults.filter(
                  (task) => task.id !== deletedTaskId
                ),
              }));
            }
          }
        );
        return subscription;
      },
    }),
    {
      name: "task-storage"
    }
  )
);


export const selectTasks = (state: TaskState) => state.tasks;
export const selectSearchtasks = (state: TaskState) => state.searchTaskResults;
export const selectSearchTaskQuery = (state: TaskState) => state.searchTaskQuery;