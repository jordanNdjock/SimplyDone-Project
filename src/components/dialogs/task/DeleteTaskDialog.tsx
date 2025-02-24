import { Trash } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../ui/alert-dialog";

interface DeleteTaskDialogProps {
  taskID: string;
  imageID: string;
  handleDeleteTask: (taskID: string, imageID: string) => void;
}

export function DeleteTaskDialog({ taskID, imageID, handleDeleteTask }: DeleteTaskDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeDialog = () => setIsOpen(false);
  const openDialog = () => setIsOpen(true);

  const handleConfirmDelete = () => {
    setIsOpen(false);
    handleDeleteTask(taskID, imageID);
  };

  return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

        <AlertDialogTrigger className="w-full flex items-center text-sm text-red-500 hover:bg-accent p-2 rounded-md hover:text-white">
            <Trash size={16} onClick={openDialog} className="mr-2 bg-red-500 text-white rounded-full w-6 h-4" />
            <span className="hidden md:block">Supprimer</span>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette tâche ?</AlertDialogTitle>
            <AlertDialogDescription>
                Cette action est irréversible. Cette tâche sera supprimée définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );
}
