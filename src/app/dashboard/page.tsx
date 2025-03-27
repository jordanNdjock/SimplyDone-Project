import { TaskList } from '@/src/components/tasks/TaskList';
import FloatingActionButton from '../../components/layout/FloatingActionButton';
import { Metadata } from "next";

export const metadata : Metadata = {
  title: "Mes tâches"
}
export default function Page() {
  return (
    <>
    <div className="p-4">
      <h1 className="text-lg md:text-xl font-bold mb-4">Mes Tâches</h1>
      <TaskList />
      <FloatingActionButton />
    </div>
  </>
  )
}
