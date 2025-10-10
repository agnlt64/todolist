
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
              toast.success(`${itemType} supprimé(e) avec succès.`);
            } catch (error) {
              toast.error(`Échec de la suppression de ${itemType.toLowerCase()}: ${error}`);
            }
          }}
        >
          <Button variant={variant} size={size ? size : "icon"} type="submit">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </TooltipTrigger>
      <TooltipContent>
        <p>{`Supprimer ${itemType}`}</p>
      </TooltipContent>
    </Tooltip>
  );
}
