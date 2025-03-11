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

interface CycleCompletionDialogProps {
  open: boolean;
  onConfirm: () => void;
  dialogContent: {
    title: string;
    description: string;
  } | null;
}

const CycleCompletionDialog: React.FC<CycleCompletionDialogProps> = ({
  open,
  onConfirm,
  dialogContent,
}) => {
  if (!dialogContent) return null;
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>
            {dialogContent.title.includes("Pause longue") ? "Reprendre" : "OK"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CycleCompletionDialog;
