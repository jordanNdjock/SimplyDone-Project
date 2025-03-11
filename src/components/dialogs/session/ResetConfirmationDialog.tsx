"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";

interface ResetConfirmationDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la réinitialisation 🔄</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir réinitialiser la session ? Cette action
            réinitialisera le timer et la playlist audio.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogAction onClick={onCancel}>
            Annuler
          </AlertDialogAction>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500">
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetConfirmationDialog;
