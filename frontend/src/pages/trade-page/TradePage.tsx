import { NavLink, useLocation } from "react-router";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TradeComponent } from "@/features/trade/components/TradeComponent";
import { TradeProvider } from "@/features/trade/components/TradeProvider";
import { DashboardPageUrl } from "@/pages/urls";

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

export default function TradePage() {
  const query = useQueryParams();

  const trader1_id = query.get("trader1_id") || undefined;
  const trader2_id = query.get("trader2_id") || undefined;

  return (
    <div className="container max-w-4xl py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <NavLink to={DashboardPageUrl}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </NavLink>
      </Button>

      <TradeProvider trader1_id={trader1_id} trader2_id={trader2_id}>
        <TradeComponent />
      </TradeProvider>
    </div>
  );
}
