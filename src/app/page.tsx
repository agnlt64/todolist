import { prisma } from "@/app/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CollectionFormDialog, TaskFormDialog } from "@/components/Forms";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const highPriorityTasks = await prisma.task.findMany({
    where: { priority: "HIGH", isDone: false },
    orderBy: { createdAt: "desc" },
  });

  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TodoList</h1>
        <div className="flex gap-2">
          <Link href="/history" className="text-blue-500 hover:underline">
            History
          </Link>
          <CollectionFormDialog>
            <Button>New Collection</Button>
          </CollectionFormDialog>
          <TaskFormDialog collections={collections}>
            <Button>New Task</Button>
          </TaskFormDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Important Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {highPriorityTasks.map((task) => (
                <li key={task.id} className="mb-2">
                  <p className="font-semibold">{task.name}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500">{task.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {collections.map((collection) => (
                <li key={collection.id} className="mb-2 flex justify-between">
                  <Link
                    href={`/collections/${collection.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {collection.name}
                  </Link>
                  <div className="flex gap-2">
                    <CollectionFormDialog collection={collection}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </CollectionFormDialog>
                    <form
                      action={async () => {
                        "use server";
                        await prisma.collection.delete({
                          where: { id: collection.id },
                        });
                        revalidatePath("/");
                      }}
                    >
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
