import { prisma } from "@/app/lib/prisma";
import { TaskFormDialog } from "@/components/Forms";
import { DeleteButton } from "@/components/DeleteButtons";
import { BreadcrumbComponent } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { TaskCard } from "@/components/TaskCard";

type PageProps = {
  params: { id: string };
};

export default async function CollectionPage({ params }: PageProps) {
  const { id } = params;
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: { tasks: { orderBy: { createdAt: "desc" } } },
  });

  if (!collection) {
    notFound();
  }

  const collections = await prisma.collection.findMany();

  async function deleteCollectionAction() {
    "use server";
    await prisma.$transaction([
      prisma.task.deleteMany({ where: { collectionId: id } }),
      prisma.collection.delete({ where: { id } }),
    ]);
    redirect("/");
  }

  async function deleteTaskAction(taskId: string) {
    "use server";
    await prisma.task.delete({ where: { id: taskId } });
    revalidatePath(`/collections/${id}`);
  }

  async function updateTaskStatusAction(taskId: string, isDone: boolean) {
    "use server";
    await prisma.task.update({
      where: { id: taskId },
      data: { isDone, doneAt: isDone ? new Date() : null },
    });
    revalidatePath(`/collections/${id}`);
  }

  const activeTasks = collection.tasks.filter((task) => !task.isDone);
  const completedTasks = collection.tasks.filter((task) => task.isDone);

  return (
    <main>
      <BreadcrumbComponent collectionName={collection.name} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{collection.name}</h1>
        <div className="flex gap-2">
          <TaskFormDialog collections={collections} collectionId={id}>
            <Button className="text-white">New Task</Button>
          </TaskFormDialog>
          <DeleteButton
            deleteAction={deleteCollectionAction}
            text="Collection"
            variant="destructive"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">To Do</h2>
        <div className="grid gap-4">
          {activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              collections={collections}
              deleteTaskAction={deleteTaskAction}
              updateTaskStatusAction={updateTaskStatusAction}
            />
          ))}
          {activeTasks.length === 0 && (
            <p className="text-muted-foreground">No tasks to do in this collection.</p>
          )}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Completed</h2>
          <div className="grid gap-4">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                collections={collections}
                deleteTaskAction={deleteTaskAction}
                updateTaskStatusAction={updateTaskStatusAction}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}