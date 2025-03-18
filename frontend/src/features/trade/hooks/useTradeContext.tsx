import { createContext, useContext } from "react";
import { TradeContextType } from "../components/TradeProvider";

export const TradeContext = createContext<TradeContextType | undefined>(
  undefined
);

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error("useTrade must be used within a TradeProvider");
  }
  return context;
};
