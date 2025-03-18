import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const SurvivorStatusBadge = ({
  isInfected,
}: {
  isInfected: boolean;
}) => {
  if (isInfected) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
        <AlertTriangle className="h-3 w-3" />
        Infected
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="bg-green-50 text-green-700 border-green-200 w-fit"
    >
      Healthy
    </Badge>
  );
};
