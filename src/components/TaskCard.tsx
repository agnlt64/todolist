
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/Forms";
import { DeleteButton } from "@/components/DeleteButtons";
import { Collection } from "@prisma/client";
import { Task } from "@prisma/client";

type TaskCardProps = {
  task: Task;
  collections: Collection[];
  deleteTaskAction: (taskId: string) => Promise<void>;
  updateTaskStatusAction: (taskId: string, isDone: boolean) => Promise<void>;
};

export function TaskCard({ task, collections, deleteTaskAction, updateTaskStatusAction }: TaskCardProps) {
  return (
    <Card>
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
            <DeleteButton
              deleteAction={deleteTaskAction.bind(null, task.id)}
              text="Task"
              variant="destructive"
              size="sm"
            />
            <form
              action={async () => {
                "use server";
                await updateTaskStatusAction(task.id, !task.isDone);
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
            className={`text-xs font-medium px-2 py-1 rounded-md ${
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
  );
}
