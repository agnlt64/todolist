import { prisma } from "@/app/lib/prisma";
import { BreadcrumbComponent } from "@/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              <p className="font-semibold">{task.name}</p>
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
