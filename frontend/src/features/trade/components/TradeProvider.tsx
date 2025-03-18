import type React from "react";

import { useEffect, useState } from "react";

import { useItemsFetch } from "@/features/inventory/hooks/useItemsFetch";
import { useSurvivorsFetchDetailed } from "@/features/survivors/hooks/useSurvivorsFetch";
import { itemsRecordToArray } from "@/lib/utils";
import { SurvivorDetailed, SurvivorsTrade } from "@/models";
import { TradeContext } from "../hooks/useTradeContext";

const calculateTradePoints = (
  selectedItems: Record<string, number>,
  itemPoints: Record<string, number>
) => {
  if (!selectedItems) {
    return 0;
  }

  return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
    return total + itemPoints[itemId as keyof typeof itemPoints] * quantity;
  }, 0);
};

const handleTraderItemChange = ({
  itemId,
  quantity,
  selectedItems,
}: {
  itemId: string;
  quantity: number;
  selectedItems: Record<string, number>;
}) => {
  if (quantity === 0) {
    const newSelected = { ...selectedItems };
    delete newSelected[itemId];

    return newSelected;
  } else {
    return {
      ...selectedItems,
      [itemId]: quantity,
    };
  }
};

type StringNumberMap = Record<string, number>;

export type TradeContextType = {
  trader1?: SurvivorDetailed;
  setTrader1: (survivor: SurvivorDetailed | undefined) => void;
  trader2?: SurvivorDetailed;
  setTrader2: (survivor: SurvivorDetailed | undefined) => void;
  survivors: SurvivorDetailed[];
  handleTrader1ItemChange: (itemId: string, quantity: number) => void;
  handleTrader2ItemChange: (itemId: string, quantity: number) => void;
  trader1Points: number;
  trader2Points: number;
  trader1Selected: StringNumberMap;
  trader2Selected: StringNumberMap;
  isLoading: boolean;
  isBalanced: boolean;
  itemPoints: StringNumberMap;
  getTradePayload: () => SurvivorsTrade;
};

type TradeProviderProps = {
  trader1_id?: string;
  trader2_id?: string;
  children: React.ReactNode;
};
export const TradeProvider = ({
  children,
  trader1_id,
  trader2_id,
}: TradeProviderProps) => {
  const { survivors, isLoading } = useSurvivorsFetchDetailed();
  const { items } = useItemsFetch();

  const itemPoints = items.reduce((acc: { [key: string]: number }, item) => {
    acc[item.id] = item.points;
    return acc;
  }, {});

  const [trader1, setTrader1] = useState<SurvivorDetailed>();
  const [trader2, setTrader2] = useState<SurvivorDetailed>();

  const [trader1Selected, setTrader1Selected] = useState<StringNumberMap>({});
  const [trader2Selected, setTrader2Selected] = useState<StringNumberMap>({});

  const trader1Points = calculateTradePoints(trader1Selected, itemPoints);
  const trader2Points = calculateTradePoints(trader2Selected, itemPoints);

  useEffect(() => {
    if (!survivors) return;

    if (trader1_id) {
      const trader = survivors.find((survivor) => survivor.id === trader1_id);
      if (!trader) return;
      setTrader1(trader);
    }

    if (trader2_id) {
      const trader = survivors.find((survivor) => survivor.id === trader2_id);
      if (!trader) return;
      setTrader2(trader);
    }
  }, [survivors, trader1_id, trader2_id]);

  const isBalanced =
    trader1Points > 0 && trader2Points > 0 && trader1Points === trader2Points;

  const handleTrader2ItemChange = (itemId: string, quantity: number) => {
    setTrader2Selected(
      handleTraderItemChange({
        itemId,
        quantity,
        selectedItems: trader2Selected,
      })
    );
  };

  const handleTrader1ItemChange = (itemId: string, quantity: number) => {
    setTrader1Selected(
      handleTraderItemChange({
        itemId,
        quantity,
        selectedItems: trader1Selected,
      })
    );
  };

  const getTradePayload = (): SurvivorsTrade => {
    const items1 = itemsRecordToArray(trader1Selected);
    const items2 = itemsRecordToArray(trader2Selected);

    const trade: SurvivorsTrade = {
      survivor_1_id: trader1!.id,
      survivor_2_id: trader2!.id,
      survivor_1_items: items1,
      survivor_2_items: items2,
    };

    return trade;
  };

  return (
    <TradeContext.Provider
      value={{
        trader1,
        setTrader1,
        trader1Points,
        trader1Selected,
        trader2,
        setTrader2,
        trader2Points,
        trader2Selected,
        survivors,
        handleTrader1ItemChange,
        handleTrader2ItemChange,
        isLoading,
        isBalanced,
        itemPoints,
        getTradePayload,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};
