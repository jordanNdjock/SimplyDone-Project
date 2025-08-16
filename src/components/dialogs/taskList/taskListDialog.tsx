import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { TaskListForm } from "../../forms/taskList/TaskListForm";
import { TaskList } from "@/src/models/taskList";

interface TaskListDialogProps {
  open: boolean;
  onClose: () => void;
  taskList?: TaskList | null;
}

export function TaskListDialog({ open, onClose, taskList}: TaskListDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] rounded-lg  overflow-y-auto" aria-describedby="ajouter une liste" aria-description="ajouter une liste">
        <DialogHeader>
          <DialogTitle> {taskList ? "Modifier la liste" : "Ajouter une liste"}</DialogTitle>
        </DialogHeader>
        <TaskListForm onClose={onClose} taskList={taskList} />
      </DialogContent>
    </Dialog>
  );
}
