export interface User {
    $id: string;
    email: string;
    name: string;
    registeredAt?: string;
    avatarUrl?: string;
    role?: string;
    avatarId?: string;
    hasSeenIntro?: boolean;
}
  
export interface AuthState {
    user: User | null;
    theme: string;
    setTheme: (theme: string) => void;
    authenticated: boolean;
    fetchUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
    updateProfile: (name: string, avatarUrl: string, avatarId: string) => Promise<void>;
    markUserAsSeenIntro: (val: boolean) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    listenToAppwrite: () => void;
  }
  