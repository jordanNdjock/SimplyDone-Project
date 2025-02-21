import React, { createContext, useContext, useState } from "react";
import { taskSchema } from "../utils/schemas";
import { z } from "zod";

// Définir le type du contexte
type TaskFormContextType = {
  initialValues: z.infer<typeof taskSchema>;
  setInitialValues: (values: z.infer<typeof taskSchema>) => void;
  tempValues: z.infer<typeof taskSchema>; // Valeurs temporaires
  setTempValues: (values: z.infer<typeof taskSchema>) => void; // Mettre à jour les valeurs temporaires
};

// Créer le contexte avec des valeurs par défaut
const TaskFormContext = createContext<TaskFormContextType>({
  initialValues: {
    title: "",
    description: "",
    start_date: "",
    image_url: "",
    end_date: "",
    color: "#475569",
    is_followed: false,
    priority: "none",
    is_repeat: false,
  },
  setInitialValues: () => {},
  tempValues: {
    title: "",
    description: "",
    start_date: "",
    image_url: "",
    end_date: "",
    color: "#475569",
    is_followed: false,
    priority: "none",
    is_repeat: false,
  },
  setTempValues: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useTaskFormContext = () => useContext(TaskFormContext);

// Fournisseur de contexte
export function TaskFormProvider({ children }: { children: React.ReactNode }) {
  const [initialValues, setInitialValues] = useState<z.infer<typeof taskSchema>>({
    title: "",
    description: "",
    start_date: "",
    image_url: "",
    end_date: "",
    color: "#475569",
    is_followed: false,
    priority: "none",
    is_repeat: false,
  });

  const [tempValues, setTempValues] = useState<z.infer<typeof taskSchema>>(initialValues);

  return (
    <TaskFormContext.Provider value={{ initialValues, setInitialValues, tempValues, setTempValues }}>
      {children}
    </TaskFormContext.Provider>
  );
}