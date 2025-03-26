import { selectTasks, useTaskStore } from "@/src/store/taskSlice";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

export function SkeletonTask() {
  const tasks = useTaskStore(selectTasks);
  return (
    <div className="grid gap-2">
      {tasks && tasks.map((_, index) => (
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
            <Skeleton className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
          </div>
          <Skeleton className="w-1/5 h-2 bg-gray-300 dark:bg-gray-600 rounded-md" />
          <Skeleton className="w-2 h-8 bg-gray-300 dark:bg-gray-600 rounded-md hidden md:block" />
        </motion.div>
      ))}
    </div>
  );
}
