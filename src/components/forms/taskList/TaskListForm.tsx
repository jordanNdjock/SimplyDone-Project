"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import { ColorSelect } from "../../tasks/ColorSelect";
import { TaskList } from "@/src/models/taskList";
import { UseTaskListStore } from "@/src/store/taskListSlice";
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { LoaderCircle } from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import { useTaskStore } from "@/src/store/taskSlice";

interface TaskListFormProps {
  onClose: () => void;
  taskList?: TaskList | null;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Le nom est requis" }),
  color: z.string().min(1, { message: "La couleur est requise" }),
});

type FormValues = z.infer<typeof formSchema>;

export function TaskListForm({ taskList, onClose }: TaskListFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: taskList?.title || "",
      color: taskList?.color || "#94A3B8",
    },
  });

  const user = useAuthStore(selectUser);
  const [loading, setLoading] = useState(false);
  const { addTaskList, updateTaskList } = UseTaskListStore();
  const { fetchTasks } = useTaskStore();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const taskListData = {
        ...data,
        user_id: user?.$id || "",
      };
      if (taskList?.id) {
        await updateTaskList(taskList.id, taskListData);
        await fetchTasks(user?.$id ?? "");
      } else {
        await addTaskList(taskListData);
      }

      form.reset();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      onClose();
      toast({
        title: message,
        variant: "error",
      })
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="title">Nom de la liste</Label>
              <FormControl>
                <Input id="title" placeholder="Ma liste" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={() => (
            <FormItem>
              <FormControl>
                <ColorSelect  form={form} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {taskList?.id ? "Modifier" : "Ajouter"}{" "}
            {loading && <LoaderCircle className="animate-spin h-5 w-5 text-white" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
