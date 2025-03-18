import { formatCoordinate } from "@/lib/utils";

interface LocationDisplayProps {
  latitude: number;
  longitude: number;
  numbersAfterDecimal?: number;
}

export function LocationDisplay({
  latitude,
  longitude,
  numbersAfterDecimal = 2,
}: LocationDisplayProps) {
  return (
    <div className="flex items-start space-x-2">
      <div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="text-sm font-medium">Latitude:</div>
          <div className="text-sm">
            {formatCoordinate({
              value: latitude,
              type: "lat",
              numbersAfterDecimal,
            })}
          </div>

          <div className="text-sm font-medium">Longitude:</div>
          <div className="text-sm">
            {formatCoordinate({
              value: longitude,
              type: "lng",
              numbersAfterDecimal,
            })}
          </div>
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          {latitude.toFixed(numbersAfterDecimal)},{" "}
          {longitude.toFixed(numbersAfterDecimal)}
        </div>
      </div>
    </div>
  );
}
