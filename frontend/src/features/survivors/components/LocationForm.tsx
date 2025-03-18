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

const locationSchema = z.object({
  latitude: z.coerce.number().int().min(-90).max(90),
  longitude: z.coerce.number().int().min(-180).max(180),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

export function LocationForm({
  location,
  loading,
  onSubmit,
}: {
  loading?: boolean;
  onSubmit: (values: LocationFormValues) => void;
  location?: LocationFormValues;
}) {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      latitude: location?.latitude || 0,
      longitude: location?.longitude || 0,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
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

        <div className="self-end flex gap-4">
          <Button>Cancel</Button>
          <Button disabled={loading} type="submit">
            {loading ? "Loading..." : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
