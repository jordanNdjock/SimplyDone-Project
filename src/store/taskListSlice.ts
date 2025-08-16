import {create} from "zustand";
import {persist} from "zustand/middleware";
import { TaskListState} from "../models/taskList";
import { ID, db, TaskListCollectionId, databaseId, Query} from "@/src/lib/appwrite";
import { mapTaskListInformation } from "../utils/mapTaskListInformations";
import { toast } from "../hooks/use-toast";


export const UseTaskListStore = create(
    persist<TaskListState>(
        (set) => ({
            taskLists: [],
            
            fetchTaskLists: async (userId: string) => {
                    try {
                      const result = await db.listDocuments(databaseId, TaskListCollectionId, [Query.equal("user_id", userId), Query.limit(100) ]);
                      const taskLists = result.documents.map((task) => mapTaskListInformation(task));
                      set({ taskLists });
                    } catch (error: unknown) {
                      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
                      toast({
                        title: message,
                        variant: "error",
                      });
                    }
            },

            addTaskList: async (taskList) => {
                try {
                    const documentId = ID.unique();
                    await db.createDocument(databaseId, TaskListCollectionId, documentId, taskList);
                    const taskListWithId = { ...taskList, id: documentId };

                    set((state) => ({ taskLists: [taskListWithId, ...state.taskLists] }));
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
                    toast({
                        title: message,
                        variant: "error",
                    });
                }
            },

            updateTaskList: async (taskListId, updates) => {
                try {
                     set((state) => ({
                        taskLists: state.taskLists.map((t) =>
                        t.id === taskListId ? { ...t, ...updates } : t
                        ),
                    }));
                    await db.updateDocument(databaseId, TaskListCollectionId, taskListId, updates);
                } catch (error: unknown) {
                    const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
                    toast({
                        title: message,
                        variant: "error",
                    });
                }
            },

            removeTaskList: async (taskListId) => {
                try {
                    await db.deleteDocument(databaseId, TaskListCollectionId, taskListId);
                    set((state) => ({
                        taskLists: state.taskLists.filter((t) => t.id !== taskListId),
                    }));
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
            name: "task-list-storage",
        }
    )
)
