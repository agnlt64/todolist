
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type DeleteButtonProps = {
  deleteAction: () => Promise<void>;
  text: string;
  variant?: "destructive";
  size?: "sm";
};

export function DeleteButton({ deleteAction, text, variant, size }: DeleteButtonProps) {
  return (
    <form
      action={async () => {
        try {
          await deleteAction();
          toast.success(`${text} deleted successfully.`);
        } catch (error) {
          toast.error(`Failed to delete ${text.toLowerCase()}.`);
        }
      }}
    >
      <Button variant={variant} size={size} type="submit">
        {`Delete ${text}`}
      </Button>
    </form>
  );
}
