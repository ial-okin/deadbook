import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InventoryItem } from "@/models";

type SurvivorTradeCardProps = {
  name: string;
  inventory: InventoryItem[];
  itemPoints: Record<string, number>;
  selectedItems: Record<string, number>;
  onItemChange: (id: string, quantity: number) => void;
};

export const TraderCard = ({
  name,
  inventory,
  itemPoints,
  selectedItems,
  onItemChange,
}: SurvivorTradeCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{name}'s Items</CardTitle>
      </CardHeader>
      {inventory.length === 0 && (
        <CardContent className="space-y-4">Survivor has no items</CardContent>
      )}
      <CardContent className="space-y-">
        {inventory.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                {itemPoints[item.id]} points each • Available: {item.quantity}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max={item.quantity}
                value={selectedItems[item.id] || 0}
                onChange={(e) =>
                  onItemChange(item.id, Number.parseInt(e.target.value) || 0)
                }
                className="w-16"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
