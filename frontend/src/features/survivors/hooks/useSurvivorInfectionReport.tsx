import { toast } from "sonner";

import { useDialog } from "@/hooks/useDialog";
import { SurvivorDetailed } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import { InfectionReportForm } from "../components/InfectionReportForm";
import { useNavigate } from "react-router";
import { DashboardPageUrl } from "@/pages/urls";

const API_URL = import.meta.env.VITE_API_URL;
const INFECTION_THRESHOLD = import.meta.env.VITE_INFECTION_THRESHOLD;

type Report = {
  survivor_id: string;
  reporter_id: string;
};

const reportSurvivorAsInfected = async ({
  survivor_id,
  reporter_id,
}: Report) => {
  const response = await fetch(
    `${API_URL}/survivors/${survivor_id}/report-infection`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reporter_id,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(`Survivor was already reported by this reporter`);
    }

    if (response.status === 404) {
      throw new Error(`Survivor was already marked as infected....`);
    }

    throw new Error(`Opps something went wrong`);
  }

  return response.json();
};

export function useSurvivorInfectionReport() {
  const { openDialog, closeDialog } = useDialog();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onReportConfirmed = async (report: Report) => {
    try {
      const response = await reportSurvivorAsInfected(report);

      queryClient.invalidateQueries({ queryKey: ["survivors"] });
      queryClient.invalidateQueries({
        queryKey: ["survivor-id", report.survivor_id],
      });

      const wasMarkedAsInfected =
        response?.count === parseInt(INFECTION_THRESHOLD);
      const reportMessage = wasMarkedAsInfected
        ? "Survivor was marked as infected"
        : "Survivor was reported";
      toast.success(reportMessage);

      if (wasMarkedAsInfected) {
        navigate(DashboardPageUrl);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {
      closeDialog();
    }
  };

  const reportInfection = (survivor: SurvivorDetailed) => {
    openDialog({
      title: "Report user as infected",
      description: `Are you sure you want to report ${survivor.name} as infected?`,
      content: (
        <InfectionReportForm
          reported_id={survivor.id}
          onReport={(reporter_id) => {
            onReportConfirmed({ survivor_id: survivor.id, reporter_id });
          }}
        />
      ),
    });
  };

  return {
    reportInfection,
  };
}
