
"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type DeleteButtonProps = {
  deleteAction: () => Promise<void>;
  itemType: string;
  variant?: "destructive";
  size?: "sm";
};

export function DeleteButton({ deleteAction, itemType, variant, size }: DeleteButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <form
          action={async () => {
            try {
              await deleteAction();
              toast.success(`${itemType} deleted successfully.`);
            } catch (error) {
              toast.error(`Failed to delete ${itemType.toLowerCase()}.`);
            }
          }}
        >
          <Button variant={variant} size={size ? size : "icon"} type="submit">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </TooltipTrigger>
      <TooltipContent>
        <p>{`Delete ${itemType}`}</p>
      </TooltipContent>
    </Tooltip>
  );
}
