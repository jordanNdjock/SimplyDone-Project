import { format, isToday, isTomorrow, parseISO, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const getInitials = (name?: string, isDashboard?: boolean): string | null => {
  if (!name || !name.trim()) return null;

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return isDashboard
    ? capitalize(words[0].slice(0, 7))
    : capitalize(words[0].slice(0, 1)); 
  } else {
    return words.map(word => word[0].toUpperCase()).join("").slice(0, 5);
  }
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

  // Cas 3 : start_date est hier et end_date est aujourd'hui
  if (isToday(end) && isYesterday(start)) {
    return "Aujourd'hui"
  }

   // Cas 4 : Même mois et même année
   if (
    format(start, "MM yyyy", { locale: fr }) === format(end, "MM yyyy", { locale: fr })
  ) {
    const yearFormat = start.getFullYear() === currentYear ? "dd MMM" : "dd MMM yyyy"
    return `${format(start, "dd", { locale: fr })}-${format(end, yearFormat, { locale: fr })}`
  }

  // Cas 5 : Même année mais mois différents
  if (format(start, "yyyy", { locale: fr }) === format(end, "yyyy", { locale: fr })) {
    const yearFormat = start.getFullYear() === currentYear ? "dd MMM" : "dd MMM yyyy"
    return `${format(start, "dd MMM", { locale: fr })} - ${format(end, yearFormat, { locale: fr })}`
  }

  // Cas 6 : Années différentes
  return `${format(start, "dd MMM yyyy", { locale: fr })} - ${format(end, "dd MMM yyyy", { locale: fr })}`
}

export function hasDatePassed(dateInput: string) {
  const givenDate = new Date(dateInput);
  const today = new Date();
  givenDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return givenDate < today;
}
