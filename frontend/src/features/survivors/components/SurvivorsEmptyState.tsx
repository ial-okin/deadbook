import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function EmptySurvivorsState() {
  return (
    <Card className="w-full max-w-md mx-auto border-dashed">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-xl">
          No Survivors Registered
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pb-2 pt-2">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Users className="h-12 w-12 text-muted-foreground" />
        </div>

        <p className="text-center text-muted-foreground  max-w-[250px]">
          There are no survivors in the system yet. Start by adding the first
          survivor to your community.
        </p>
      </CardContent>
    </Card>
  );
}
