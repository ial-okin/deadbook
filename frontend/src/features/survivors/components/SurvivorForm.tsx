import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useItemsFetch } from "@/features/inventory/hooks/useItemsFetch";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const itemSchema = z.object({
  item_id: z.string().min(1), // id should be a non-empty string
  quantity: z.number().int().min(1), // quantity should be a positive integer
});

const survivorSchema = z.object({
  name: z.string().min(3),
  age: z.coerce.number().int().positive("Required"),
  gender: z.enum(["M", "F"]),
  latitude: z.coerce.number().int().min(-90).max(90),
  longitude: z.coerce.number().int().min(-180).max(180),
  inventory: z.array(itemSchema).optional(),
});

export type SurvivorFormValues = z.infer<typeof survivorSchema>;

export function SurvivorForm({
  onSubmit,
  loading,
}: {
  onSubmit: (values: SurvivorFormValues) => void;
  loading?: boolean;
}) {
  const form = useForm<SurvivorFormValues>({
    resolver: zodResolver(survivorSchema),
    defaultValues: {
      name: "",
      gender: "M",
      inventory: [],
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter survivor name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Age */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Enter age" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                  className="flex gap-4"
                >
                  <FormItem className="flex items-center  space-y-0">
                    <FormControl>
                      <RadioGroupItem value="M" />
                    </FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0">
                    <FormControl>
                      <RadioGroupItem value="F" />
                    </FormControl>
                    <FormLabel className="font-normal">Female</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <section className="flex gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={-90}
                    max={90}
                    placeholder="Enter latitude (-90 to 90)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={-180}
                    max={180}
                    placeholder="Enter longitude (-180 to 180)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="w-full">
          <ItemsForm onItems={(items) => form.setValue("inventory", items)} />
        </section>

        <div className="self-end flex gap-4">
          <Button>Cancel</Button>
          <Button disabled={loading} type="submit">
            {loading ? "Loading..." : "Add Survivor"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

type ItemEntry = {
  item_id: string;
  quantity: number;
};

const ItemsForm = ({ onItems }: { onItems: (items: ItemEntry[]) => void }) => {
  const { items: db_items } = useItemsFetch();

  const [items, _setItems] = useState<ItemEntry[]>([]);

  const setItems = (newItems: ItemEntry[]) => {
    // if user selects the same item multiple times, we should merge them
    const mergedItems = mergeItemsById(newItems);

    _setItems(mergedItems);

    onItems(mergedItems.filter((item) => item.item_id !== ""));
  };

  const addItem = () => {
    setItems([...items, { item_id: "", quantity: 1 }]);
  };

  const handleItemChange = (
    index: number,
    field: keyof ItemEntry,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length >= 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  return (
    <div className="space-y-4 ">
      <div className="flex items-center justify-between">
        <Label>Inventory</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="flex gap-4 items-end ">
          <div className="w-full">
            <Label htmlFor={`item-${index}`} className="text-sm">
              Item
            </Label>
            <Select
              value={item.item_id}
              onValueChange={(value) =>
                handleItemChange(index, "item_id", value)
              }
            >
              <SelectTrigger id={`item-${index}`} className="w-full">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {db_items.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`quantity-${index}`} className="text-sm">
              Quantity
            </Label>
            <Input
              id={`quantity-${index}`}
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(
                  index,
                  "quantity",
                  Number.parseInt(e.target.value) || 1
                )
              }
              className="w-20"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      ))}
    </div>
  );
};

const mergeItemsById = (items: ItemEntry[]) => {
  const itemIdMap = new Map<string, number>();
  items.forEach((item) => {
    if (itemIdMap.has(item.item_id)) {
      itemIdMap.set(
        item.item_id,
        (itemIdMap.get(item.item_id) || 0) + item.quantity
      );
    } else {
      itemIdMap.set(item.item_id, item.quantity);
    }
  });

  return Array.from(itemIdMap).map(([item_id, quantity]) => ({
    item_id,
    quantity,
  }));
};
