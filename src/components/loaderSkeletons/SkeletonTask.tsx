import { selectTasks, useTaskStore } from "@/src/store/taskSlice";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

export function SkeletonTask() {
  const tasks = useTaskStore(selectTasks);
  return (
    <div className="grid gap-2.5">
      {tasks && tasks.map((task, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1 p-3 rounded-lg shadow-lg bg-gray-200 dark:bg-gray-700"
        >
          <Skeleton className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
            {task.description && <Skeleton className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />}
          </div>
          {task.image_url && <Skeleton className="h-12 w-12 bg-gray-300 mr-6 dark:bg-gray-600 rounded-md hidden md:block"/>}
          {task.end_date && <Skeleton className="w-1/5 lg:w-1/12 lg:mr-4 h-2 bg-gray-300 dark:bg-gray-600 rounded-md" />}
          <Skeleton className="w-2 h-6 mr-4 bg-gray-300 dark:bg-gray-600 rounded-md hidden md:block" />
          {task.image_url && <Skeleton className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-sm md:hidden mt-8" />}
        </motion.div>
      ))}
    </div>
  );
}
