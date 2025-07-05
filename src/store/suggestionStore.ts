import { ID } from "appwrite";
import { create } from "zustand";
import { Suggestion, SuggestionState } from "../models/suggestion";
import { toast } from "../hooks/use-toast";
import { databaseId, db, SuggestionCollectionId } from "../lib/appwrite";

export const useSuggestionStore = create<SuggestionState>((set) => ({
  suggestions: [],

  addSuggestion: async (suggestion: Suggestion) => {
    try {
        const documentId = ID.unique();
        const newSuggestion: Suggestion = {
            ...suggestion,
        };
        await db.createDocument(databaseId, SuggestionCollectionId, documentId, newSuggestion);
        const suggestionWithId = { ...newSuggestion, id: documentId };
        set((state) => ({ suggestions: [suggestionWithId, ...state.suggestions] }));
    } catch (error) {
        const message =
            error instanceof Error
              ? error.message
              : "Une erreur inconnue est survenue";
        toast({ title: message, variant: "error" });
    }
  }
}));