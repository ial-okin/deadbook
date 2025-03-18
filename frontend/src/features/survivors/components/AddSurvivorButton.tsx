import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  SurvivorForm,
  SurvivorFormValues,
} from "@/features/survivors/components/SurvivorForm";
import { useSurvivorCreate } from "@/features/survivors/hooks/useSurvivorCreate";
import { useDialog } from "@/hooks/useDialog";

export const AddSurvivorButton = () => {
  const { openDialog, closeDialog } = useDialog();
  const { createSurvivor, isPending } = useSurvivorCreate();

  const onData = (data: SurvivorFormValues) => {
    createSurvivor.mutate(
      {
        ...data,
        inventory: data.inventory ?? [],
      },
      {
        onSuccess: () => {
          closeDialog();
        },
      }
    );
  };

  const openSurvivorForm = () => {
    openDialog({
      title: "Add New Survivor",
      description: "Register a new survivor in the system",
      content: <SurvivorForm onSubmit={onData} loading={isPending} />,
    });
  };

  return (
    <Button size="sm" onClick={openSurvivorForm}>
      <>
        <PlusCircle className="h-4 w-4" />
        <span className="sr-only md:not-sr-only">Add Survivor</span>
      </>
    </Button>
  );
};
