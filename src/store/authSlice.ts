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
      theme: "system",

      fetchUser: async () => {
        try {
          const result = await account.get();
          const user = mapUserInformation(result);
          const storedTheme = result.prefs.theme || "system";
          if(user != null){
            set({ user, authenticated: true, theme: storedTheme });
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
          const message = error instanceof Error ? error.message === "There was an error processing your request. Please check the inputs and try again." ? "Ooups ! Un autre compte est déjà crée avec cette adresse email" : error.message : "Une erreur inconnue est survenue";
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
          "Mot de passe ou email incorrect. Veuillez vérifier vos informations !" : error.message : 
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

      updateProfile: async (name: string, avatarUrl: string) => {
        try {
          // if (email) {
          //   await account.updateEmail(email, password);
          // }
          const currentUser = await account.get();
          const currentPrefs = currentUser.prefs || {};

          await account.updatePrefs({
            ...currentPrefs,
            avatar: avatarUrl,
          });
          await account.updateName(name);
          const updatedUser = await account.get();
          const user = mapUserInformation(updatedUser);
          set({ user });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
           throw new Error(message);
        }
      },
      setTheme: async (theme) => {
        set({ theme });

        try {
          const user = await account.get();
          const currentPrefs = user.prefs || {};

          await account.updatePrefs({
            ...currentPrefs,
            theme,
          });
        } catch (error) {
          console.error("Erreur lors de la mise à jour du thème :", error);
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

