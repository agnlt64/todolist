import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { CollectionFormDialog } from "@/components/Forms";
import { Button } from "@/components/ui/button";

export async function Navbar() {
  const collections = await prisma.collection.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <nav className="p-4 bg-card rounded-lg h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Collections</h2>
        <CollectionFormDialog>
          <Button size="sm" className="text-white">New</Button>
        </CollectionFormDialog>
      </div>
      <ul className="mb-4">
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link href={`/collections/${collection.id}`} className="block p-2 hover:bg-accent rounded-md">
              {collection.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/history" className="text-sm text-muted-foreground hover:underline">
        View tasks history
      </Link>
    </nav>
  );
}