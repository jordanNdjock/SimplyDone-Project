import { Task } from '../models/task';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapTaskInformation = (task: any): Task => {
    return {
      id: task.$id ?? "",
      user_id: task.user_id ?? "",
      title: task.title ?? null,
      description: task.description ?? null,
      completed: task.completed ?? null,
      image_url: task.image_url ?? null,
      color: task.color ?? null,
      is_repeat: task.is_repeat ?? null,
      is_followed: task.is_followed ?? null,
      start_date: task.start_date ?? null,
      end_date: task.end_date ?? null,
      taskList: task.taskList?.$id ?? null,
      priority: task.priority ?? null,
      image_id: task.image_id ?? null,
      createdAt: task.$createdAt ?? null,
    };
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */