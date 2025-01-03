import React from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

const SkeletonProfile = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-6">
      <Skeleton className="h-24 w-24 rounded-full" />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-48 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-3">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-10 h-10" />
        </CardContent>
      </Card>

      <Card className="w-full max-w-md border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">
            <Skeleton className="w-40 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-10" />
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonProfile;
