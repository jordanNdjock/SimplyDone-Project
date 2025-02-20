"use client"
import { TaskList } from '@/src/components/tasks/TaskList';
import FloatingActionButton from '../../components/layout/FloatingActionButton';
import { ScrollArea } from '@/src/components/ui/scroll-area';

export default function Page() {
  return (
    <>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mes Tâches</h1>
      <ScrollArea className="h-[80vh] w-full">
          <TaskList />
      </ScrollArea>
      <FloatingActionButton />
    </div>
  </>
  )
}
