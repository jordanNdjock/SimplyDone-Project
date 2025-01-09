"use client"
import { TaskList } from '@/src/components/tasks/TaskList';
import FloatingActionButton from '../../components/layout/FloatingActionButton';

export default function Page() {
  return (
    <>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Mes Tâches</h1>
      <TaskList />
      <FloatingActionButton />
    </div>
  </>
  )
}
