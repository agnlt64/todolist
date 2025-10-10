import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { CollectionFormDialog } from "@/components/Forms";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export async function Navbar() {
  const collections = await prisma.collection.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          tasks: {
            where: {
              isDone: false,
            },
          },
        },
      },
    },
  });

  return (
    <nav className="p-4 bg-card rounded-lg h-fit fixed">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Collections</h2>
        <CollectionFormDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button size="icon" className="text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Créer une nouvelle collection</p>
            </TooltipContent>
          </Tooltip>
        </CollectionFormDialog>
      </div>
      <ul className="mb-4">
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link
              href={`/collections/${collection.id}`}
              className="block p-2 hover:bg-accent rounded-md"
            >
              <div className="flex justify-between items-center gap-2">
                <span>{collection.name}</span>
                <span className="text-xs bg-red-500 text-white font-bold rounded-full px-2 py-1">
                  {collection._count.tasks}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/history"
        className="text-sm text-muted-foreground hover:underline"
      >
        Voir l&apos;historique des tâches
      </Link>
    </nav>
  );
}