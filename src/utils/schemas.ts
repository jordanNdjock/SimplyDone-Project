import { z } from "zod"

export const taskSchema = z
  .object({
    title: z.string().min(1, "Le titre de la tâche ne peut être vide"),
    description: z.string().optional(),
    image_url: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    color: z.string().default("#4A90E2"),
    priority: z.enum(["none", "low", "medium", "high"]).default("none"),
    is_followed: z.boolean().default(false),
    is_repeat: z.boolean().default(false),
    taskList: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.end_date && !data.start_date) {
        return false
      }
      return true
    },
    {
      message: "La date de début doit être définie si la date de fin est définie.",
      path: ["start_date"],
    }
  )
  .refine(
    (data) => {
      if (!data.start_date || !data.end_date) return true

      const startDate = new Date(data.start_date)
      const endDate = new Date(data.end_date)

      return endDate >= startDate
    },
    {
      message: "La date de fin de la tâche doit être supérieure ou égale à la date de début.",
      path: ["end_date"],
    }
  )