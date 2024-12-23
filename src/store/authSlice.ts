import { create } from "zustand";
import { persist } from "zustand/middleware";
import { account, ID } from "@/src/lib/appwrite";
import { AuthState } from "@/src/models/user";
import { mapUserInformation } from "../utils/mappingUserInformations";

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      authenticated: false,

      fetchUser: async () => {
        try {
          const result = await account.get();
          const user = mapUserInformation(result);
          if(user != null){
            set({ user, authenticated: true });
          }else{
            throw new Error("Erreur lors de la récupération de l'utilisateur");
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          set({ user: null });
          throw new Error(message);
        }
      },

      signup: async (name, email, password) => {
        try {
          const result = await account.create(ID.unique(), email, password, name);
          await account.createEmailPasswordSession(email, password);
          const user = mapUserInformation(result);
          if(user != null){
            set({ user, authenticated: true });
          }else{
            throw new Error("Erreur lors de l'inscription'");
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          set({ user: null });
          throw new Error(message);
        }
      },

      login: async (email, password) => {
        try {
          await account.createEmailPasswordSession(email, password);
          const result = await account.get();
          const user = mapUserInformation(result);
          if(user != null){
            set({ user, authenticated: true });
          }else{
            throw new Error("Erreur lors de la connexion");
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message === "Invalid credentials. Please check the email and password." ? 
          "Mot de passe ou email incorrect. Veuillez vérifier vos informations !" : "Une erreur inconnue est survenue" : 
          "Une erreur inconnue est survenue";
          set({ user: null });
          throw new Error(message);
        }
      },

      logout: async () => {
        try {
          await account.deleteSession("current");
          set({ user: null, authenticated: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          throw new Error(message);
        }
      },

      changePassword: async (oldPassword, newPassword) => {
        try {
          await account.updatePassword(newPassword, oldPassword);
        } catch (error: unknown) {
           const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
           throw new Error(message);
        }
      },

      updateProfile: async (name: string, password: string,email?: string) => {
        try {
          if (email) {
            await account.updateEmail(email, password);
          }
          await account.updateName(name);
          const user = await account.get();
          set({ user });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
           throw new Error(message);
        }
      },

    }),
    {
      name: "auth-storage",
    }
  )
);

export const selectUser = (state: AuthState) => state.user;
export const selectAuthenticated = (state: AuthState) => state.authenticated;

