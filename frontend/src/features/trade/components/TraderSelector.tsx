import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurvivorDetailed } from "@/models";

type TraderSelectorProps = {
  trader?: SurvivorDetailed;
  secondTraderId?: string;
  survivors: SurvivorDetailed[];
  onTraderSelect: (survivor: SurvivorDetailed) => void;
  index: number;
};
export const TraderSelector = ({
  trader,
  survivors,
  secondTraderId,
  onTraderSelect,
  index,
}: TraderSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-base">Trader {index}</Label>
      <Select
        value={trader?.id}
        onValueChange={(id) => {
          const selectedSurvivor = survivors.find((s) => s.id === id);
          if (selectedSurvivor) {
            onTraderSelect?.(selectedSurvivor);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select survivor" />
        </SelectTrigger>
        <SelectContent>
          {survivors.map((survivor) => (
            <SelectItem
              key={survivor.id}
              value={survivor.id}
              disabled={survivor.id === secondTraderId}
            >
              {survivor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
