import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { BreadcrumbComponent } from "@/components/Breadcrumb";

export default async function HomePage() {
  const importantTasks = await prisma.task.findMany({
    where: {
      priority: 'HIGH',
      isDone: false,
    },
    include: {
      collection: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <BreadcrumbComponent />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Important Tasks</h1>
      </div>
      <div className="space-y-4">
        {importantTasks.map(task => (
          <div key={task.id} className="p-4 bg-card rounded-lg border-l-4 border-destructive">
            <div className="flex justify-between items-center">
              <Link href={`/collections/${task.collectionId}#task-${task.id}`} className="font-semibold hover:underline">
                {task.name}
              </Link>
              {task.collection && (
                <Link href={`/collections/${task.collection.id}`} className="text-sm text-muted-foreground hover:underline">
                  {task.collection.name}
                </Link>
              )}
            </div>
            {task.description && (
              <p className="text-muted-foreground mt-2">{task.description}</p>
            )}
          </div>
        ))}
        {importantTasks.length === 0 && (
          <div className="p-4 bg-card rounded-lg text-center text-muted-foreground">
            No important tasks for now.
          </div>
        )}
      </div>
    </div>
  );
}