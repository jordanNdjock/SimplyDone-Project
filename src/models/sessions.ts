export interface Session {
    id?: string;
    user_id: string;
    method_id: string;
    started_at: string;
    ended_at?: string;
    status: string;
    work_duration: number;
    break_duration: number;
    cycles_completed: number;
    notes?: string;
}

export interface SessionState {
    sessions: Session[];
    fetchSessions: (userId: string) => Promise<void>;
    addSession: (session: Omit<Session, "id">, userId: string) => Promise<void>;
    updateSession: (session: Session, updates: Partial<Session>) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
}