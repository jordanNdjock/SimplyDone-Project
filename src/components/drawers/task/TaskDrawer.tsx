"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/src/components/ui/drawer";
import { TaskForm } from "@/src/components/forms/task/TaskForm";

interface TaskDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function TaskDrawer({ open, onClose }: TaskDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent aria-describedby="ajouter une tâche" aria-description="ajouter une tâche" className="overflow-auto">
        <DrawerHeader className="text-left">
          <DrawerTitle>Ajouter une tâche</DrawerTitle>
        </DrawerHeader>
        <TaskForm onClose={onClose}  />
        <DrawerClose className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition">
          ✕
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
}
