import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

type LocationPayload = {
  survivor_id: string;
  latitude: number;
  longitude: number;
};

const _updateLocation = async (location: LocationPayload) => {
  const { survivor_id, ...rest } = location;

  const response = await fetch(`${API_URL}/survivors/${survivor_id}/location`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });

  if (!response.ok) {
    throw new Error(`Failed to register survivor: ${response.statusText}`);
  }

  return response.json();
};

export function useSurvivorLocationMutation() {
  const updateLocation = useMutation({
    mutationFn: _updateLocation,
    onError: (error: Error) => {
      toast.error("Error updating location");
      console.error(error);
    },
  });

  return {
    updateLocation,
    isPending: updateLocation.isPending,
  };
}
