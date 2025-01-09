import { motion } from "framer-motion";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";

const urgencyLevels = [
  { value: 1, label: "Très faible", color: "#D1D5DB" },
  { value: 2, label: "Faible", color: "#93C5FD" },
  { value: 3, label: "Moyenne", color: "#60A5FA" },
  { value: 4, label: "Élevée", color: "#FACC15" },
  { value: 5, label: "Critique", color: "#EF4444" },
];

interface UrgencyImportancePickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function UrgencyImportancePicker({ label, value, onChange }: UrgencyImportancePickerProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="relative flex items-center justify-between w-full gap-1 py-2">

        <motion.div
          className="absolute top-1/2 left-0 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg w-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(value - 1) * 25}%` }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div
          className="absolute top-1/2 left-0 transform -translate-x-1/2 bg-primary w-3 h-3 rounded-full"
          initial={{ x: "0%" }}
          animate={{ x: `${(value - 1) * 25}%` }}
          transition={{ duration: 0.3 }}
        />

        {urgencyLevels.map((level) => (
          <motion.button
            type="button"
            key={level.value}
            onClick={() => onChange(level.value)}
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center transition-all relative shadow-md",
              value === level.value
                ? "scale-125 ring-2 ring-white dark:ring-gray-800"
                : "opacity-80 hover:opacity-100"
            )}
            whileTap={{ scale: 0.9 }}
            style={{ backgroundColor: level.color }}
          >
            {value === level.value && (
              <motion.div
                layoutId="selected"
                className="w-4 h-4 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>
        ))}

        <motion.div
          className="absolute top-1/2 right-0 transform translate-x-1/2 bg-primary w-3 h-3 rounded-full"
          initial={{ x: "100%" }}
          animate={{ x: `${(value - 1) * 25}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
