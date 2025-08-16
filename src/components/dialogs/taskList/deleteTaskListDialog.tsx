import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../../ui/alert-dialog";

interface DeleteTaskListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskListName: string;
  onConfirm: () => Promise<void>;
}

export function DeleteTaskListDialog({
  isOpen,
  onClose,
  taskListName,
  onConfirm
}: DeleteTaskListDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Supprimer la liste « {taskListName} » ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. La liste et toutes ses tâches seront supprimées définitivement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirmer la suppression
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
