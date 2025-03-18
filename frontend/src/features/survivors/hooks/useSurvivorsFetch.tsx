import { Survivor, SurvivorDetailed } from "@/models";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const fetchSurvivors = async () => {
  const res = await fetch(`${API_URL}/survivors`);
  if (!res.ok) {
    throw new Error("Failed to fetch survivors");
  }
  return res.json();
};

export const useSurvivorsFetch = () => {
  const {
    data = [],
    error,
    isLoading,
  } = useQuery<Survivor[]>({
    queryKey: ["survivors"],
    queryFn: fetchSurvivors,
  });

  return {
    survivors: data ?? [],
    isLoading,
    error,
  };
};

const fetchSurvivorsDetailed = async () => {
  const res = await fetch(`${API_URL}/survivors/detailed`);
  if (!res.ok) {
    throw new Error("Failed to fetch survivors");
  }
  return res.json();
};

export const useSurvivorsFetchDetailed = () => {
  const {
    data = [],
    error,
    isLoading,
  } = useQuery<SurvivorDetailed[]>({
    queryKey: ["survivors-detailed"],
    queryFn: fetchSurvivorsDetailed,
  });

  return {
    survivors: data ?? [],
    isLoading,
    error,
  };
};

const fetchSurvivorDetailed = async (survivor_id: string) => {
  const res = await fetch(`${API_URL}/survivors/${survivor_id}/detailed`);
  if (!res.ok) {
    throw new Error("Failed to fetch survivors");
  }
  return res.json();
};

export const useSurvivorFetchDetailed = (survivor_id?: string) => {
  const { data, error, isLoading } = useQuery<SurvivorDetailed>({
    queryKey: ["survivor-id", survivor_id],
    queryFn: () => fetchSurvivorDetailed(survivor_id!),
    enabled: !!survivor_id,
  });

  return {
    survivor: data,
    isLoading,
    error,
  };
};
