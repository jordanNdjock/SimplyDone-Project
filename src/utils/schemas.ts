import z from "zod";

export const taskSchema = z.object({
  title: z.string().min(3, "Le titre de la tâche doit contenir au moins 3 caractères."),
  description: z.string().optional(),
  image_url: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  color: z.string().default("#4A90E2"),
  urgency: z.number().default(1),
  importance: z.number().default(1),
  is_followed: z.boolean().default(false),
  is_repeat: z.boolean().default(false),
}).refine(
  (data) => {
    if (!data.start_date || !data.end_date) return true;

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);

    return endDate >= startDate;
  },
  {
    message: "La date de fin de la tâche doit être supérieure ou égale à la date de début.",
    path: ["end_date"],
  }
);