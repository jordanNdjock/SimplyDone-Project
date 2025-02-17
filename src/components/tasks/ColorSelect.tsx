import { useTheme } from "next-themes";
import { Palette } from "lucide-react";
import { FormControl, FormField, FormItem } from "../ui/form";
import { Label } from "../ui/label";
import { UseFormReturn } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ColorSelectProps {
  form: UseFormReturn<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function ColorSelect({ form }: ColorSelectProps) {
  const { theme } = useTheme();

  const themeColors = theme === "dark" 
    ? [
        { name: "primary", class: "bg-primary" }, 
        { name: "green-800", class: "bg-green-800" }, 
        { name: "amber-900", class: "bg-amber-900" }
      ] 
    : [
        { name: "accent", class: "bg-accent" },
        { name: "neutral-600", class: "bg-neutral-600" }, 
        { name: "teal-800", class: "bg-teal-800" }
      ];

  const handleColorSelect = (color: string) => {
    form.setValue("color", color);
  };

  return (
    <FormField control={form.control} name="color" render={({ field }) => (
      <FormItem>
        <Label><Palette size={16} className="inline-block mr-1" /> Couleur</Label>
        <FormControl>
          <div className="flex justify-between">
            {themeColors.map((color, index) => (
              <div 
                key={index} 
                className={`w-12 h-12 cursor-pointer rounded-full border-2 ${color.class} ${color.name === field.value ? "border-yellow-500 dark:border-white" : "border-transparent"}`} 
                onClick={() => handleColorSelect(color.name)}
              />
            ))}
          </div>
        </FormControl>
      </FormItem>
    )} />
  );
}
