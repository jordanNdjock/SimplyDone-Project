import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { TaskForm } from "@/src/components/forms/task/TaskForm";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
}

export function TaskDialog({ open, onClose }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto" aria-describedby="ajouter une tâche" aria-description="ajouter une tâche">
        <DialogHeader>
          <DialogTitle>Ajouter une tâche</DialogTitle>
        </DialogHeader>
        <TaskForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
