import { Item } from "@/models";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const fetchItems = async () => {
  const res = await fetch(`${API_URL}/items`);
  if (!res.ok) {
    throw new Error("Failed to fetch items");
  }
  return res.json();
};

export const useItemsFetch = () => {
  const {
    data = [],
    error,
    isLoading,
  } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: () => fetchItems(),
  });

  return {
    items: data ?? [],
    isLoading,
    error,
  };
};
