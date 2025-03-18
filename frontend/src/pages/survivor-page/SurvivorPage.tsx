import LoadingState from "@/components/LoadingState";
import { NavLink, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { useSurvivorFetchDetailed } from "@/features/survivors/hooks/useSurvivorsFetch";
import { SurvivorProfileOverview } from "@/features/survivors/components/SurvivorProfileOverview";
import { DashboardPageUrl } from "@/pages/urls";

export const SurvivorPage = () => {
  const { id } = useParams();
  const { survivor, isLoading } = useSurvivorFetchDetailed(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!id || !survivor) {
    return (
      <div className="container py-8">
        <p>Survivor id not provided</p>
        <Button asChild className="mt-4">
          <NavLink to={DashboardPageUrl}>Back to Dashboard</NavLink>
        </Button>
      </div>
    );
  }

  return <SurvivorProfileOverview survivor={survivor} />;
};
