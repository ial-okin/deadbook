import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const itemsRecordToArray = (items: Record<string, number>) =>
  Object.entries(items).map(([item_id, quantity]) => ({
    item_id,
    quantity,
  }));

export const formatCoordinate = ({
  value,
  type,
  numbersAfterDecimal,
}: {
  value: number;
  type: "lat" | "lng";
  numbersAfterDecimal: number;
}) => {
  const direction =
    type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";

  const absValue = Math.abs(value);
  return `${absValue.toFixed(numbersAfterDecimal)}° ${direction}`;
};

export const formatLocation = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  return `${formatCoordinate({
    value: latitude,
    type: "lat",
    numbersAfterDecimal: 1,
  })} ${formatCoordinate({
    value: longitude,
    type: "lng",
    numbersAfterDecimal: 1,
  })}`;
};
