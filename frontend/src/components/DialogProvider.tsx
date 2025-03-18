import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createContext, ReactNode, useState } from "react";

type DialogOptions = {
  title: string;
  description?: string;
  content: ReactNode;
};

type DialogContextType = {
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
};

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const openDialog = (options: DialogOptions) => setDialog(options);
  const closeDialog = () => setDialog(null);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      <>
        {children}
        {dialog && (
          <Dialog open={true} onOpenChange={closeDialog}>
            <DialogContent>
              <DialogHeader className="flex justify-start">
                <DialogTitle>{dialog.title}</DialogTitle>
                {dialog.description && (
                  <DialogDescription>{dialog.description}</DialogDescription>
                )}
              </DialogHeader>
              {dialog.content}
            </DialogContent>
          </Dialog>
        )}
      </>
    </DialogContext.Provider>
  );
}
