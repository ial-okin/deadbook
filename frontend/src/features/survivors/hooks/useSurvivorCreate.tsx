import { SurvivorCreatePayload } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

const _createSurvivor = async (payload: SurvivorCreatePayload) => {
  const response = await fetch(`${API_URL}/survivors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to register survivor: ${response.statusText}`);
  }

  return response.json();
};

export function useSurvivorCreate() {
  const queryClient = useQueryClient();
  const createSurvivor = useMutation({
    mutationFn: _createSurvivor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survivors"] });
      toast.success("Survivor registered");
    },
    onError: (error: Error) => {
      toast.error("Error creating survivor");
      console.error(error);
    },
  });

  return {
    createSurvivor,
    isPending: createSurvivor.isPending,
  };
}
