import { format, isToday, isTomorrow, parseISO, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

export const getInitials = (name?: string): string | null => {
    if (!name || name.trim().length === 0) {
      return null;
    }
  
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0].toUpperCase()}${names[1][0].toUpperCase()}`;
    }
  
    return names[0][0].toUpperCase();
};

export const getProrityLabel = (priority: "none" | "low" | "medium" | "high") => {
  switch (priority) {
    case "none":
      return "Aucune";
    case "low":
      return "Basse";
    case "medium":
      return "Moyenne";
    case "high":
      return "Élevée";
    default:
      return "Aucune";
  }
};

export function formatTaskDates(startDate: string, endDate: string): string {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  const currentYear = new Date().getFullYear()

  // Cas 1 : Les dates sont égales
  if (start.toISOString() === end.toISOString()) {
    if (isToday(start)) {
      return "Aujourd'hui"
    }
    if (isYesterday(start)) {
      return "Hier"
    }

    const yearFormat = start.getFullYear() === currentYear ? "dd MMM" : "dd MMM yyyy"
    return format(start, yearFormat, { locale: fr })
  }

  // Cas 2 : start_date est aujourd'hui et end_date est demain
  if (isToday(start) && isTomorrow(end)) {
    return "Demain"
  }


   // Cas 3 : Même mois et même année
   if (
    format(start, "MM yyyy", { locale: fr }) === format(end, "MM yyyy", { locale: fr })
  ) {
    const yearFormat = start.getFullYear() === currentYear ? "dd MMM" : "dd MMM yyyy"
    return `${format(start, "dd", { locale: fr })}-${format(end, yearFormat, { locale: fr })}`
  }

  // Cas 4 : Même année mais mois différents
  if (format(start, "yyyy", { locale: fr }) === format(end, "yyyy", { locale: fr })) {
    const yearFormat = start.getFullYear() === currentYear ? "dd MMM" : "dd MMM yyyy"
    return `${format(start, "dd MMM", { locale: fr })} - ${format(end, yearFormat, { locale: fr })}`
  }

  // Cas 5 : Années différentes
  return `${format(start, "dd MMM yyyy", { locale: fr })} - ${format(end, "dd MMM yyyy", { locale: fr })}`
}