import { prisma } from "@/app/lib/prisma";
import { BreadcrumbComponent } from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function HistoryPage() {
  const completedTasks = await prisma.task.findMany({
    where: { isDone: true },
    orderBy: { doneAt: 'desc' },
  });

  return (
    <main>
      <BreadcrumbComponent />
      <h1 className="text-2xl font-bold mb-4">History</h1>

      <div className="grid gap-4">
        {completedTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <Link href={`/collections/${task.collectionId}`} className="font-semibold">{task.name}</Link>
              {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
              <p className="text-sm text-gray-400 mt-2">
                Completed on {task.doneAt?.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
