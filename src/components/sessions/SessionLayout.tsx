"use client"

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { selectMethods, useMethodStore } from '../../store/methodSlice';
import { Loader2 } from "lucide-react";
import WorkSession from "./WorkSession";

export default function SessionLayout() {
  const methods = useMethodStore(selectMethods);
  const { fetchMethods } = useMethodStore();
  const [selectedMethodId, setSelectedMethodId] = useState<string>("");

  useEffect(() => {
    fetchMethods();
  }, []);

  useEffect(() => {
    if (methods && methods.length > 0) {
      setSelectedMethodId(methods[0].id);
    }
  }, [methods]);

  useEffect(() => {
    fetchMethods();
  }, []);

  return (
    <Tabs onValueChange={setSelectedMethodId} value={selectedMethodId} className="mt-6">
        <TabsList>
            {methods ? methods.map((method) =>
              <TabsTrigger key={method.id} value={method.id}>{method.name}</TabsTrigger>
            ): <Loader2 className="text-white animate-spin" size={24} />}
        </TabsList>
        {methods?.map((method) => (
        <TabsContent key={method.id} value={method.id}>
          <WorkSession methodId={selectedMethodId} />
        </TabsContent>
      ))}
    </Tabs>
  );  
}