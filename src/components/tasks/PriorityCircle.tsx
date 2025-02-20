import React from "react";
import { Circle } from "lucide-react";

interface PriorityCircleProps {
  priority?: "none" | "low" | "medium" | "high";
}

export function PriorityCircle({ priority = "none" }: PriorityCircleProps) {
  let colorClass = "text-white";

  switch (priority) {
    case "low":
      colorClass = "text-blue-500";
      break;
    case "medium":
      colorClass = "text-yellow-500";
      break;
    case "high":
      colorClass = "text-red-500";
      break;
    case "none":
    default:
      colorClass = "text-white";
      break;
  }

  return <Circle size={24} className={`${colorClass}`} />;
}
