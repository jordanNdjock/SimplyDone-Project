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
        { name: "#C71585", class: "bg-pink-800" },
        { name: "#B8860B", class: "bg-yellow-700" },
        { name: "#28A745", class: "bg-green-500" },
        { name: "#0F5E66", class: "bg-cyan-800" },
        { name: "#0D47A1", class: "bg-blue-800" }  
      ] 
    : [
        { name: "#FF1493", class: "bg-pink-600" },  
        { name: "#FFC300", class: "bg-yellow-400" }, 
        { name: "#28A745", class: "bg-green-500" },   
        { name: "#17A2B8", class: "bg-cyan-500" },   
        { name: "#007BFF", class: "bg-blue-500" },  
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
                className={`w-10 h-10 cursor-pointer rounded-full border-2 ${color.class} ${color.name === field.value ? "border-gray-800 dark:border-white" : "border-transparent"}`} 
                onClick={() => handleColorSelect(color.name)}
              />
            ))}
          </div>
        </FormControl>
      </FormItem>
    )} />
  );
}
