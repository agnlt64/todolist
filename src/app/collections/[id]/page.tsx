import { prisma } from "@/app/lib/prisma";
import { TaskFormDialog } from "@/components/Forms";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function CollectionPage({ params }: { params: { id: string } }) {
  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
    include: { tasks: { orderBy: { createdAt: "desc" } } },
  });

  if (!collection) {
    notFound();
  }

  const collections = await prisma.collection.findMany();

  return (
    <main>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{collection.name}</h1>
        <TaskFormDialog collections={collections}>
          <Button>New Task</Button>
        </TaskFormDialog>
      </div>

      <div className="grid gap-4">
        {collection.tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{task.name}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <TaskFormDialog task={task} collections={collections}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </TaskFormDialog>
                  <form
                    action={async () => {
                      "use server";
                      await prisma.task.delete({ where: { id: task.id } });
                      revalidatePath(`/collections/${collection.id}`);
                    }}
                  >
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await prisma.task.update({
                        where: { id: task.id },
                        data: { isDone: !task.isDone, doneAt: new Date() },
                      });
                      revalidatePath(`/collections/${collection.id}`);
                    }}
                  >
                    <Button variant="secondary" size="sm">
                      {task.isDone ? "Undo" : "Done"}
                    </Button>
                  </form>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    task.priority === "HIGH"
                      ? "bg-red-500 text-white"
                      : task.priority === "MEDIUM"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}