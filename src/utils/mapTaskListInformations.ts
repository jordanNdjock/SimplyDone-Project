import { TaskList} from '../models/taskList';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapTaskListInformation = (taskList: any): TaskList => {
    return {
      id: taskList.$id ?? "",
      user_id: taskList.user_id ?? "",
      title: taskList.title ?? null,
      color: taskList.color ?? null,
    };
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */