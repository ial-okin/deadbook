import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useSurvivorLocationMutation } from "@/features/survivors/hooks/useSurvivorLocationMutation";
import { useDialog } from "@/hooks/useDialog";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LocationForm, LocationFormValues } from "./LocationForm";

export const ChangeLocationButton = ({
  survivor_id,
  latitude,
  longitude,
}: {
  survivor_id: string;
  latitude: number;
  longitude: number;
}) => {
  const { openDialog, closeDialog } = useDialog();
  const { updateLocation, isPending } = useSurvivorLocationMutation();
  const queryClient = useQueryClient();

  const onData = (data: LocationFormValues) => {
    updateLocation.mutate(
      {
        survivor_id,
        ...data,
      },
      {
        onSuccess: () => {
          closeDialog();
          toast.success("Location updated");
          queryClient.invalidateQueries({
            queryKey: ["survivor-id", survivor_id],
          });
        },
        onError: () => {
          toast.error("Error updating location");
        },
      }
    );
  };

  const openLocationForm = () => {
    openDialog({
      title: "Change Location",
      description: "Fill the form to change the survivor location",
      content: (
        <LocationForm
          location={{
            latitude: latitude,
            longitude: longitude,
          }}
          onSubmit={onData}
          loading={isPending}
        />
      ),
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full sm:w-auto mt-4"
      onClick={openLocationForm}
    >
      <Edit className="mr-2 h-4 w-4" />
      Change location
    </Button>
  );
};
