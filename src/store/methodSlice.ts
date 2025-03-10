import { create } from "zustand";
import { toast } from "../hooks/use-toast";
import { databaseId, db, MethodCollectionId } from "../lib/appwrite";
import { mapMethodInformation } from "../utils/mapMethodInformations";
import { MethodState } from "../models/method";

export const useMethodStore = create<MethodState>(
  (set) => ({
    methods: [],
    fetchMethods: async () => {
      try {
        const result = await db.listDocuments(databaseId, MethodCollectionId);
        const methods = result.documents.map((method) => mapMethodInformation(method));
        set({ methods });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
        toast({
          title: message,
          variant: "error",
        });
      }
    },
  }));

  export const selectMethods = (state : MethodState) => state.methods;
  export const selectMethodById = (state : MethodState, id : string) => state.methods.find((method) => method.id === id);