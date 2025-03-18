import { SurvivorsTrade } from "@/models";
import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const _makeTrade = async (payload: SurvivorsTrade) => {
  const response = await fetch(`${API_URL}/trade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to register survivor: ${response.statusText}`);
  }

  return response.json();
};

export const useTradeMutation = () => {
  const makeTrade = useMutation({
    mutationFn: _makeTrade,
  });

  return {
    makeTrade,
    isPending: makeTrade.isPending,
  };
};
