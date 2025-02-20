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