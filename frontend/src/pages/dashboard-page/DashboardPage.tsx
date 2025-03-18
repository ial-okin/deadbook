import { Dashboard } from "@/pages/dashboard-page/components/Dashboard";
import { useSurvivorsFetch } from "@/features/survivors/hooks/useSurvivorsFetch";

export const DashboardPage = () => {
  const { survivors, isLoading, error } = useSurvivorsFetch();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>Error fetching data</div>;
  }

  return (
    <div className="h-svh pt-8">
      <Dashboard survivors={survivors} />
    </div>
  );
};
