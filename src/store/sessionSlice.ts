// // stores/session-store.ts
// import { create } from "zustand";
// import { databaseId, db, ID, Query, SessionCollectionId } from "../lib/appwrite";
// import { toast } from "../hooks/use-toast";
// import { Session } from "../models/sessions";

// type SessionState = {
//   sessions: Session[];
//   currentSession: Session | null;
//   fetchSessions: (userId: string) => Promise<void>;
//   startSession: (session: Omit<Session, "id">, userId: string) => Promise<void>;
//   updateSession: (sessionId: string, updates: Partial<Session>) => Promise<void>;
// };

// export const useSessionStore = create<SessionState>((set) => ({
//   sessions: [],
//   currentSession: null,
//   fetchSessions: async (userId) => {
//     try {
//       const result = await db.listDocuments(
//         databaseId,
//         SessionCollectionId,
//         [Query.equal("user_id", userId)]
//       );
//       const session = map
//       set({ sessions: result.documents as Session[] });
//     } catch (error) {
//       handleError(error);
//     }
//   },
//   startSession: async (session, userId) => {
//     try {
//       const doc = await db.createDocument(
//         databaseId,
//         SessionCollectionId,
//         ID.unique(),
//         { ...session, user_id: userId }
//       );
//       set({ currentSession: doc as Session });
//     } catch (error) {
//       handleError(error);
//     }
//   },
//   updateSession: async (sessionId, updates) => {
//     try {
//       const doc = await db.updateDocument(
//         databaseId,
//         SessionCollectionId,
//         sessionId,
//         updates
//       );
//       set((state) => ({
//         sessions: state.sessions.map(s => 
//           s.id === sessionId ? { ...s, ...doc } : s
//         ),
//         currentSession: doc as Session
//       }));
//     } catch (error) {
//       handleError(error);
//     }
//   },
// }));

// function handleError(error: unknown) {
//   const message = error instanceof Error ? error.message : "Erreur inconnue";
//   toast({ title: message, variant: "error" });
// }