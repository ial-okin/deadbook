import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TradePoints } from "@/features/trade/components/TradePoints";
import { TraderCard } from "@/features/trade/components/TraderCard";
import { TraderSelector } from "@/features/trade/components/TraderSelector";
import { TradeStatus } from "@/features/trade/components/TradeStatus";
import { useTradeContext } from "@/features/trade/hooks/useTradeContext";
import { useTradeMutation } from "@/features/trade/hooks/useTradeMutation";
import { DashboardPageUrl } from "@/pages/urls";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const TradeComponent = () => {
  const {
    trader1,
    trader2,
    survivors,
    setTrader1,
    setTrader2,
    trader1Points,
    trader2Points,
    itemPoints,
    isBalanced,
    trader1Selected,
    trader2Selected,
    handleTrader1ItemChange,
    handleTrader2ItemChange,
    isLoading,
    getTradePayload,
  } = useTradeContext();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { makeTrade, isPending } = useTradeMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trade = getTradePayload();
    makeTrade.mutate(trade, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["survivors-detailed"] });
        queryClient.invalidateQueries({
          queryKey: ["survivor-id", trade.survivor_1_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["survivor-id", trade.survivor_2_id],
        });

        setTrader1(undefined);
        setTrader2(undefined);

        toast.success("Trade completed");

        navigate(DashboardPageUrl);
      },
      onError: (error) => {
        console.log(error);
        toast.error("Error completing trade");
      },
    });
  };

  if (isLoading) {
    <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Resources</CardTitle>
        <CardDescription>
          Exchange items between survivors (points must be equal)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Trader 1 Selection */}
            <TraderSelector
              trader={trader1}
              survivors={survivors}
              onTraderSelect={setTrader1}
              secondTraderId={trader2?.id}
              index={1}
            />

            {/* Trader 2 Selection */}
            <TraderSelector
              trader={trader2}
              survivors={survivors}
              onTraderSelect={setTrader2}
              secondTraderId={trader1?.id}
              index={2}
            />
          </div>
          {/* Trade Items Section */}
          {trader1 && trader2 && (
            <>
              <div className="flex items-center justify-center gap-2 my-4">
                <TradePoints title="Trader 1 Points" points={trader1Points} />
                <TradeStatus isBalanced={isBalanced} />
                <TradePoints title="Trader 2 Points" points={trader2Points} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trader 1 Items */}
                <TraderCard
                  name={trader1.name}
                  inventory={trader1.inventory}
                  itemPoints={itemPoints}
                  selectedItems={trader1Selected}
                  onItemChange={handleTrader1ItemChange}
                />

                {/* Trader 2 Items */}
                <TraderCard
                  name={trader2.name}
                  inventory={trader2.inventory}
                  itemPoints={itemPoints}
                  selectedItems={trader2Selected}
                  onItemChange={handleTrader2ItemChange}
                />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button
              disabled={!isBalanced}
              className={!isBalanced ? "opacity-50" : ""}
              type="submit"
            >
              {isPending ? "Saving trade ..." : "Complete Trade"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
