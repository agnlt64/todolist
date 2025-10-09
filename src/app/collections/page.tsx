
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { BreadcrumbComponent } from "@/components/Breadcrumb";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <BreadcrumbComponent />
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <div className="grid gap-4">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className="block p-4 bg-card rounded-lg hover:bg-accent"
          >
            {collection.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
