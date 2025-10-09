"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/Forms";
import { DeleteButton } from "@/components/DeleteButtons";
import { DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Check, Undo } from "lucide-react";

import { Collection } from "@prisma/client";
import { Task } from "@prisma/client";

type TaskCardProps = {
  task: Task;
  deleteTaskAction: (taskId: string) => Promise<void>;
  updateTaskStatusAction: (taskId: string, isDone: boolean) => Promise<void>;
};

export function TaskCard({ task, deleteTaskAction, updateTaskStatusAction }: TaskCardProps) {
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
            {!task.isDone && (
              <TaskFormDialog task={task}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" type="button">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit task</p>
                  </TooltipContent>
                </Tooltip>
              </TaskFormDialog>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={task.isDone ? "warning" : "secondary"}
                  size="icon"
                  type="button"
                  onClick={async () => {
                    await updateTaskStatusAction(task.id, !task.isDone);
                  }}
                >
                  {task.isDone ? <Undo className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{task.isDone ? "Mark as not done" : "Mark as done"}</p>
              </TooltipContent>
            </Tooltip>
            <DeleteButton
              deleteAction={deleteTaskAction.bind(null, task.id)}
              itemType="Task"
              variant="destructive"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-md ${task.priority === "HIGH"
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
