import { prisma } from "@/app/lib/prisma";
import { TaskFormDialog } from "@/components/Forms";
import { DeleteButton } from "@/components/DeleteButtons";
import { BreadcrumbComponent } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import { DialogTrigger } from "@/components/ui/dialog";
import { revalidatePath } from "next/cache";
import { TaskCard } from "@/components/TaskCard";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SortComponent } from "@/components/SortComponent";

type PageProps = {
  params: { id: string };
  searchParams: { sortBy?: string };
};

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = params;
  const { sortBy } = searchParams;

  let orderByClause: any = { createdAt: "desc" };

  if (sortBy === "priority-desc") {
    orderByClause = { priority: "desc" };
  } else if (sortBy === "priority-asc") {
    orderByClause = { priority: "asc" };
  }

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: orderByClause,
      },
    },
  });

  if (!collection) {
    notFound();
  }

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
          <SortComponent />
          <TaskFormDialog collectionId={id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" className="text-white">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create new task</p>
              </TooltipContent>
            </Tooltip>
          </TaskFormDialog>
          <DeleteButton
            deleteAction={deleteCollectionAction}
            itemType="Collection"
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