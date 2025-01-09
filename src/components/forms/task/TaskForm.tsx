"use client";

import {  useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskStore } from "@/src/store/taskSlice";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import { ImagePlus, Calendar as CalendarIcon, Palette, Repeat, Eye, ChevronDown, ChevronUp, LoaderCircle } from 'lucide-react';
import { selectUser, useAuthStore } from "@/src/store/authSlice";
import { UrgencyImportancePicker } from "@/src/utils/urgencyImportancePicker";
import { cn } from "@/src/lib/utils";
import { ID, storage, TasksImgBucketId } from "@/src/lib/appwrite";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { format } from "date-fns";
import {Calendar} from "@/src/components/ui/calendar";
import { toast } from "@/src/hooks/use-toast";
import Image from "next/image";
import { fr } from "date-fns/locale";
import { taskSchema } from "@/src/utils/schemas";



interface TaskFormProps {
  onClose: () => void;
}

export function TaskForm({ onClose }: TaskFormProps) {
  const user = useAuthStore(selectUser);
  const { addTask } = useTaskStore();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [loading, startTransition] = useTransition();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      image_url: "",
      end_date: "",
      color: "#4A90E2",
      urgency: 1,
      importance: 1,
      is_followed: false,
      is_repeat: false,
    },
  });

  const handleSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      startTransition(async () => {
      await addTask({
        title: data.title,
        description: data.description || "",
        image_url: data.image_url || "",
        start_date: data.start_date,
        end_date: data.end_date,
        color: data.color,
        urgence: data.urgency,
        importance: data.importance,
        is_followed: data.is_followed,
        is_repeat: data.is_repeat,
        completed: false,
        user_id: user?.$id || ""
      }, user?.$id || "");
      form.reset();
      onClose();
      toast({
        title: "Tâche ajoutée avec succès !",
        variant: "success",
      });
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
                <Input {...field} placeholder="Ex: Réviser le cours de React" />
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
          className=" flex items-center justify-center gap-2 hover:bg-transparent"
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
        
          <div className="grid grid-cols-2 gap-2">
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
                              const formattedDate = date .toLocaleDateString("fr-CA").split("T")[0];
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

          <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <Label><Palette size={16} className="inline-block mr-1" /> Couleur</Label>
                  <FormControl>
                    <Input type="color" {...field} className="cursor-pointer" />
                  </FormControl>
                </FormItem>
            )}
          />
          <UrgencyImportancePicker
            label="Urgence"
            value={form.watch("urgency")}
            onChange={(value) => form.setValue("urgency", value)}
          />

          <UrgencyImportancePicker
            label="Importance"
            value={form.watch("importance")}
            onChange={(value) => form.setValue("importance", value)}
          />

          <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant={form.watch("is_followed") ? "default" : "outline"} onClick={() => form.setValue("is_followed", !form.watch("is_followed"))}>
                <Eye size={16} /> Suivi
              </Button>

              <Button type="button" variant={form.watch("is_repeat") ? "default" : "outline"} onClick={() => form.setValue("is_repeat", !form.watch("is_repeat"))}>
                <Repeat size={16} /> Répéter
              </Button>

              <div className="col-span-2 flex flex-col items-center mt-2">
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
                    if (file) {
                      try {
                        const response = await storage.createFile(TasksImgBucketId, ID.unique(), file);

                        const imageUrl = storage.getFilePreview(TasksImgBucketId, response.$id);
                        form.setValue("image_url", imageUrl);
                        console.log(imageUrl);
                      } catch (error) {
                        console.error("Error uploading image:", error);
                      }
                    }
                  };

                  fileInput.click();
                }}
              >
                <ImagePlus size={16} /> {form.watch("image_url") ? "Changer l'image" : "Ajouter une image"}
              </Button>

              {form.watch("image_url") && (
                <div className="mt-4 w-full">
                  <Image
                    src={form.watch("image_url") || ""}
                    alt="Task Image"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" className="bg-accent dark:bg-primary text-white flex-1" disabled={loading}>Ajouter {loading && <LoaderCircle className="animate-spin h-5 w-5 text-white" />}</Button>
      </form>
    </Form>
  );
}
