import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { TaskForm } from "@/src/components/forms/task/TaskForm";
import { Task } from "@/src/models/task";
import { dateLabel } from "@/src/utils/utils";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  dateCalendar?: Date;
}

export function TaskDialog({ open, onClose, task, dateCalendar }: TaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto" aria-describedby="ajouter une tâche" aria-description="ajouter une tâche">
        <DialogHeader>
          <DialogTitle> {task ? "Modifier la tâche" : dateCalendar ? `Ajouter la tâche ${dateLabel(dateCalendar ?? new Date(), new Date())}` : "Ajouter une tâche"}</DialogTitle>
        </DialogHeader>
        <TaskForm onClose={onClose} task={task} dateCalendar={dateCalendar}/>
      </DialogContent>
    </Dialog>
  );
}
