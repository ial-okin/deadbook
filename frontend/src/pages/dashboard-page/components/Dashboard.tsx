import { NavLink } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

import { AddSurvivorButton } from "@/features/survivors/components/AddSurvivorButton";
import { SurvivorsList } from "@/features/survivors/components/SurvivorsList";
import { Survivor } from "@/models";
import { TradePageUrl } from "@/pages/urls";
import { EmptySurvivorsState } from "@/features/survivors/components/SurvivorsEmptyState";

type DashboardProps = {
  survivors: Survivor[];
};
export const Dashboard = ({ survivors }: DashboardProps) => {
  const haveSurvivors = survivors.length > 0;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 ">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-xl font-bold">Survivor Tracker</h1>
          <div className="flex items-center gap-4">
            {haveSurvivors && (
              <Button size="sm" variant="outline" asChild>
                <NavLink to={TradePageUrl}>
                  <ArrowRightLeft className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">Trade</span>
                </NavLink>
              </Button>
            )}
            <AddSurvivorButton />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid gap-6 py-4 grid-cols-1">
          <div className="col-span-1 md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Survivors</CardTitle>
                <CardDescription>
                  Overview of all registered survivors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {haveSurvivors ? (
                  <SurvivorsList survivors={survivors} />
                ) : (
                  <EmptySurvivorsState />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
