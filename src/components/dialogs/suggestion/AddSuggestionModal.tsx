"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useSuggestionStore } from "@/src/store/suggestionStore";
import { useToast } from "@/src/hooks/use-toast";
import { Suggestion } from "@/src/models/suggestion";
import { useAuthStore } from "@/src/store/authSlice";

interface AddSuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddSuggestionModal: React.FC<AddSuggestionModalProps> = ({ open, onOpenChange }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const { addSuggestion } = useSuggestionStore();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;

    setLoading(true);
    try {
      const suggestion: Suggestion = {
        user_name: user?.name ?? "",
        comments: comment.trim(),
        rating,
      };
      await addSuggestion(suggestion);

      toast({
        title: "Avis envoyé 👍",
        description: "Merci pour votre retour !",
        variant: "success",
      });

      setComment("");
      setRating(0);
      onOpenChange(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      toast({
        title: message,
        description: "Impossible d'envoyer la suggestion.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Laissez un avis à l&apos;auteur💡</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-6 h-6 cursor-pointer transition-colors",
                (hover || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              )}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              fill={(hover || rating) >= star ? "currentColor" : "none"}
            />
          ))}
        </div>

        {rating === 0 && <span className="text-xs dark:text-gray-400 text-gray-500 ">Veuillez ajouter un nombre d&apos;étoiles pour noter cette application</span>}

        <Textarea
          placeholder="Votre avis..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          disabled={!comment.trim() || rating === 0 || loading}
          className="w-full mt-4"
        >
          {loading ? "Envoi en cours..." : "Envoyer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddSuggestionModal;
