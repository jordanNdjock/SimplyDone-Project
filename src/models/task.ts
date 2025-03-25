export interface Task {
    id?: string;
    title: string;
    description?: string;
    image_url?: string;
    image_id?: string;
    completed: boolean;
    is_followed?: boolean;
    is_repeat?: boolean;
    color: string;
    priority?: "none" | "low" | "medium" | "high";
    end_date?: string;
    start_date?: string;
    category?: Array<string>;
    taskList?: Array<string>;
    comments?: Array<string>;
    user_id: string;
}

export interface TaskState {
    tasks: Task[];
    searchTaskResults: Task[];
    fetchTasks: (userId: string) => Promise<void>;
    addTask: (task: Omit<Task, "id">, userId: string) => Promise<void>;
    toggleTask: (taskId: string) => Promise<void>;
    updateTask: (task: Task, updates: Partial<Task>) => Promise<void>;
    deleteTask: (taskId: string, imageId?: string) => Promise<void>;
    searchTasks: (searchValue: string) => Promise<void>;
}