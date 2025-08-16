export interface TaskList{
    id?: string;
    title: string;
    color: string;
    user_id: string;
}

export interface TaskListState {
  taskLists: TaskList[];
  fetchTaskLists: (userId: string) => Promise<void>;
  addTaskList: (task: Omit<TaskList, "id">) => Promise<void>;
  updateTaskList: (taskListId: string, updates: Partial<TaskList>) => Promise<void>;
  removeTaskList: (taskListId: string) => Promise<void>;
}
