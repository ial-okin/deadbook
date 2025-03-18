import { AlertTriangle, ArrowLeft, MapPin, Package } from "lucide-react";
import { NavLink } from "react-router";

import { LocationDisplay } from "@/components/LocationDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChangeLocationButton } from "@/features/survivors/components/ChangeLocationButton";
import { SurvivorDetailed } from "@/models";
import { useSurvivorInfectionReport } from "../hooks/useSurvivorInfectionReport";
import { DashboardPageUrl, TradePageUrl } from "@/pages/urls";

type SurvivorProfileOverviewProps = {
  survivor: SurvivorDetailed;
};
export const SurvivorProfileOverview = ({
  survivor,
}: SurvivorProfileOverviewProps) => {
  const { reportInfection } = useSurvivorInfectionReport();

  return (
    <div className="container max-w-3xl py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <NavLink to={DashboardPageUrl}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </NavLink>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{survivor.name}</CardTitle>
              <CardDescription>
                {survivor.age} years old • {survivor.gender}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Healthy
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex gap-1">
              <h3 className="font-medium mb-2">Last Known Location</h3>
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>

            <LocationDisplay
              latitude={survivor.latitude}
              longitude={survivor.longitude}
            />

            <ChangeLocationButton
              survivor_id={survivor.id}
              latitude={survivor.latitude}
              longitude={survivor.longitude}
            />
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Resources</h3>
            <div className="flex flex-wrap gap-2">
              {survivor.inventory.map((item) => (
                <Badge key={item.id} variant="outline">
                  {item.name} {item.quantity}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <NavLink to={`${TradePageUrl}?trader1_id=${survivor.id}`}>
                <Package className="mr-2 h-4 w-4" />
                Trade Resources
              </NavLink>
            </Button>
            <Button
              variant={"destructive"}
              className="w-full sm:w-auto"
              onClick={() => reportInfection(survivor)}
            >
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Report Infection
              </>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
