import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { TaskForm } from "@/src/components/forms/task/TaskForm";
import { Task } from "@/src/models/task";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  isCalendar?: boolean;
}

export function TaskDialog({ open, onClose, task, isCalendar }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto" aria-describedby="ajouter une tâche" aria-description="ajouter une tâche">
        <DialogHeader>
          <DialogTitle> {task ? "Modifier la tâche" : isCalendar ? "Ajouter la tâche du jour" : "Ajouter une tâche"}</DialogTitle>
        </DialogHeader>
        <TaskForm onClose={onClose} task={task} isCalendar={isCalendar}/>
      </DialogContent>
    </Dialog>
  );
}
