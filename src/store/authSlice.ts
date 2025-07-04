import { create } from "zustand";
import { persist } from "zustand/middleware";
import { account, client, ID } from "@/src/lib/appwrite";
import { AuthState } from "@/src/models/user";
import { mapUserInformation } from "../utils/mapUserInformations";
import { toast } from "../hooks/use-toast";

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
            toast({
              title: "Erreur lors de la récupération de l'utilisateur",
              variant: "error",
            });
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
            toast({
              title: "Erreur lors de l'inscription'",
              variant: "error",
            });
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message === "There was an error processing your request. Please check the inputs and try again." ? "Ooups ! Un autre compte est déjà crée avec cette adresse email" : error.message : "Une erreur inconnue est survenue";
          set({ user: null });
          toast({
            title: message,
            variant: "error",
          });
        }
      },

      login: async (email, password) => {
        try {
          await account.createEmailPasswordSession(email, password);
          const result = await account.get();
          const user = mapUserInformation(result);
          if(user == null){
            toast({
              title: "Erreur lors de la connexion",
              variant: "error",
            });
          }
          set({ user, authenticated: true });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message === "Invalid credentials. Please check the email and password." ? 
          "Mot de passe ou email incorrect. Veuillez vérifier vos informations !" : error.message : 
          "Une erreur inconnue est survenue";
          set({ user: null });
          toast({
            title: message,
            variant: "error",
          });
        }
      },

      logout: async () => {
        try {
          await account.deleteSession("current");
          set({ user: null, authenticated: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
          toast({
            title: message,
            variant: "error",
          });
        }
      },

      changePassword: async (oldPassword, newPassword) => {
        try {
          await account.updatePassword(newPassword, oldPassword);
        } catch (error: unknown) {
           const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
           toast({
            title: message,
            variant: "error",
          });
        }
      },

      updateProfile: async (name: string, avatarUrl: string, avatarId: string) => {
        try {
          // if (email) {
          //   await account.updateEmail(email, password);
          // }
          const currentUser = await account.get();
          const currentPrefs = currentUser.prefs || {};

          await account.updatePrefs({
            ...currentPrefs,
            avatar: avatarUrl,
            avatarId,
          });
          await account.updateName(name);
          const updatedUser = await account.get();
          const user = mapUserInformation(updatedUser);
          set({ user });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
            toast({
              title: message,
              variant: "error",
            });
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
          const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour du thème";
          toast({
            title: message,
            variant: "error",
          });
        }
      },
      listenToAppwrite: () => {

        if (typeof window === "undefined") return;

        const subscribe = client.subscribe("account", async (response) => {
          if (response.events.includes("users.*.update.prefs")) {
            const userResponse = await account.get();
            const newTheme = userResponse.prefs.theme || "system";
            const user = mapUserInformation(userResponse);
            set({ user: user, theme: newTheme });
          }
        });
    
        return subscribe;
      },
    }),
   
    {
      name: "auth-storage",
    }
  )
);
export const selectUser = (state: AuthState) => state.user;
export const selectAuthenticated = (state: AuthState) => state.authenticated;

