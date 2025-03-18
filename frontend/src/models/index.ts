export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
};

export type Survivor = {
  id: string;
  name: string;
  age: number;
  is_infected: boolean;
  gender: "M" | "F";
  latitude: number;
  longitude: number;
};

export type SurvivorDetailed = Survivor & {
  inventory: InventoryItem[];
};

export type Item = {
  id: string;
  name: string;
  points: number;
};

export type SurvivorCreatePayload = Omit<Survivor, "id"> & {
  inventory: TradeItem[];
};

type TradeItem = {
  quantity: number;
  item_id: string;
};

export type SurvivorsTrade = {
  survivor_1_id: string;
  survivor_2_id: string;
  survivor_1_items: TradeItem[];
  survivor_2_items: TradeItem[];
};
