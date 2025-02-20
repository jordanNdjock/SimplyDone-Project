import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/src/components/ui/select";
import { Label } from "@/src/components/ui/label";
import { Flag } from "lucide-react";

interface PrioritySelectProps {
  value: "none" | "low" | "medium" | "high";
  onChange: (value: "none" | "low" | "medium" | "high") => void;
}

export function PrioritySelect({ value, onChange }: PrioritySelectProps) {
  return (

        <div className="flex flex-col gap-2">
          <Label>Priorité</Label>
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Priorité</SelectLabel>
                  <SelectItem value="none" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Flag size={16} className="text-gray-500" />
                      Aucune
                    </div>
                  </SelectItem>
                  <SelectItem value="low" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Flag size={16} className="text-blue-500" />
                      Faible
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Flag size={16} className="text-yellow-500" />
                      Moyenne
                    </div>
                  </SelectItem>
                  <SelectItem value="high" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Flag size={16} className="text-red-500" />
                      Élevée
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
        </div>
  );
}
