"use client";

import {  useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskStore } from "@/src/store/taskSlice";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import { ImagePlus, Calendar as CalendarIcon, ChevronDown, ChevronUp, LoaderCircle, ImageMinus, Trash } from 'lucide-react';
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { PrioritySelect } from "@/src/components/tasks/PrioritySelect";
import { cn } from "@/src/lib/utils";
import { ID, storage, TasksImgBucketId } from "@/src/lib/appwrite";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { format } from "date-fns";
import {Calendar} from "@/src/components/ui/calendar";
import { toast } from "@/src/hooks/use-toast";
import Image from "next/image";
import { fr } from "date-fns/locale";
import { taskSchema } from "@/src/utils/schemas";
import { Task } from "@/src/models/task";
// import { ColorSelect } from '../../tasks/ColorSelect';



interface TaskFormProps {
  onClose: () => void;
  task?: Task & { id?: string };
}

export function TaskForm({ onClose, task }: TaskFormProps) {
  const user = useAuthStore(selectUser);
  const { addTask, updateTask } = useTaskStore();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [loading, startTransition] = useTransition();
  const [file, setFile] = useState<File>();
  const [existingImageId, setExistingImageId] = useState(task?.image_id || "");

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      start_date: task?.start_date || "",
      end_date: task?.end_date || "",
      image_url: task?.image_url || "",
      color: task?.color || "#475569",
      priority: task?.priority || "none",
      is_followed: task?.is_followed || false,
      is_repeat: task?.is_repeat || false,
    },
  });

  useEffect(() => {
    if (!task?.start_date) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString("fr-CA").split("T")[0];
      form.setValue("start_date", formattedDate);
    }
  }, [form, task?.start_date])

  const handleRemoveImage = () => {
    setFile(undefined);
    form.setValue("image_url", "");
    setExistingImageId("");
  };

  const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      startTransition(async () => {
        let image_url = task?.image_url || "";
      let image_id = existingImageId;             
      if (file) {
        if (existingImageId) {
          await storage.deleteFile(TasksImgBucketId, existingImageId);
        }
        const response = await storage.createFile(TasksImgBucketId, ID.unique(), file);
        image_url = storage.getFilePreview(TasksImgBucketId, response.$id);
        image_id = response.$id;
      }

      const taskData = {
        ...data,
        start_date: data.end_date && data.end_date.length > 0 ? data.start_date : "",
        image_url,
        image_id,
        user_id: user?.$id || "",
        completed: task?.completed || false,
      };

      if (task?.id) {
        await updateTask(task, taskData);
      } else {
        await addTask(taskData, user?.$id || "");
      }

      form.reset();
      onClose();
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
      onClose();
      toast({
        title: message,
        variant: "error",
      })
      
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 p-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label>Titre de la tâche</Label>
              <FormControl>
                <Input {...field} placeholder="Que voulez-vous faire aujourd'hui?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <FormControl>
                <Textarea {...field} placeholder="Ajoutez plus de détails..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          className=" flex items-center justify-center gap-2 focus-visible:outline-none focus:outline-none outline-none dark:hover:bg-transparent text-dark dark:text-white"
          onClick={() => setShowMoreOptions(!showMoreOptions)}
        >
          {showMoreOptions ? (
            <>
              Moins d&apos;options <ChevronUp size={16} />
            </>
          ) : (
            <>
              Plus d&apos;options <ChevronDown size={16} />
            </>
          )}
        </Button>

        <div className={cn("grid gap-3 md:grid-cols-1", !showMoreOptions && "hidden")}>
        
          <div className="grid grid-cols-2 gap-2 mb-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <Label>
                  <CalendarIcon size={16} className="inline-block mr-1" /> Début
                </Label>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon size={16} className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "PPP", {locale: fr})
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                           if (date) {
                              const formattedDate = date.toLocaleDateString("fr-CA").split("T")[0];
                              field.onChange(formattedDate);
                            } else {
                              field.onChange("")
                            }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <Label>
                  <CalendarIcon size={16} className="inline-block mr-1" /> Fin
                </Label>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon size={16} className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            if (date) {
                              const formattedDate = date .toLocaleDateString("fr-CA").split("T")[0];
                              field.onChange(formattedDate);
                            } else {
                              field.onChange("")
                            }
                          }
                        }}
                        locale={fr}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>

          {/* <ColorSelect form={form} /> */}

          <div className="grid grid-cols-2 gap-2">
              <PrioritySelect 
                value={form.watch("priority")}
                onChange={(value: "none" | "low" | "medium" | "high") => form.setValue("priority", value)} />
               
              {/* <Button type="button" variant={form.watch("is_followed") ? "default" : "outline"} onClick={() => form.setValue("is_followed", !form.watch("is_followed"))}>
                <Eye size={16} /> Suivre
              </Button>

              <Button type="button" variant={form.watch("is_repeat") ? "default" : "outline"} onClick={() => form.setValue("is_repeat", !form.watch("is_repeat"))}>
                <Repeat size={16} /> Répéter
              </Button> */}
              <div className="flex flex-col gap-2">
                <Label className="">Image</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";

                    fileInput.onchange = async (event: Event) => {
                      const target = event.target as HTMLInputElement;
                      const file = target.files?.[0];
                      setFile(file);
                      if (file) {
                        try {
                            const imageUrl = URL.createObjectURL(file);
                            form.setValue("image_url", imageUrl);
                        } catch (error) {
                          console.error("Error uploading image:", error);
                        }
                      }
                    };

                    fileInput.click();
                  }}
                >
                  {form.watch("image_url") ? 
                  (
                    <>
                    <ImageMinus size={16} /> 
                    Changer l&apos;image
                    </>
                  )
                  : 
                  (
                    <>
                    <ImagePlus size={16} /> 
                      Ajouter une image
                    </>
                  )}
                </Button>
              </div>
              
              <div className="col-span-2 flex flex-col items-center">
                  {form.watch("image_url") && (
                  <>
                    <div className="mt-4 w-full">
                      <Image
                        src={form.watch("image_url") || ""}
                        width={300}
                        height={300}
                        alt="Task Image"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleRemoveImage}
                      >
                        <Trash size={16} />
                      </Button>
                    </>
                  )}
              </div>
          </div>
        </div>

        <Button type="submit" className="bg-accent dark:bg-primary text-white flex-1" disabled={loading}>
          {task?.id ? "Modifier" : "Ajouter"}  
          {loading && <LoaderCircle className="animate-spin h-5 w-5 text-white" />}
        </Button>
      </form>
    </Form>
  );
}
