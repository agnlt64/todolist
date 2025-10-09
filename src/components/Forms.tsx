"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Collection, Task } from "@prisma/client";
import { Plus, Save } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CollectionFormProps = {
  collection?: Collection;
  onFinished?: () => void;
};

export function CollectionForm({ collection, onFinished }: CollectionFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: collection?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof collectionSchema>) {
    const res = await fetch(
      `/api/collections${collection ? `/${collection.id}` : ""}`,
      {
        method: collection ? "PATCH" : "POST",
        body: JSON.stringify(values),
      }
    );
    if (res.ok) {
      onFinished?.();
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Collection name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="submit" size="icon">
              {collection ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{collection ? "Update collection" : "Create collection"}</p>
          </TooltipContent>
        </Tooltip>
      </form>
    </Form>
  );
}

type CollectionFormDialogProps = {
  collection?: Collection;
  children: React.ReactNode;
};

export function CollectionFormDialog({ collection, children }: CollectionFormDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {collection ? "Edit" : "Create"} Collection
          </DialogTitle>
        </DialogHeader>
        <CollectionForm
          collection={collection}
          onFinished={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

const taskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  collectionId: z.string().optional(),
});

type TaskFormProps = {
  task?: Task;
  collections: Collection[];
  onFinished?: () => void;
  collectionId?: string;
};

export function TaskForm({ task, collections, onFinished, collectionId }: TaskFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: task?.name || "",
      description: task?.description || "",
      priority: task?.priority || "LOW",
      collectionId: task?.collectionId || collectionId,
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    const res = await fetch(`/api/tasks${task ? `/${task.id}` : ""}`, {
      method: task ? "PATCH" : "POST",
      body: JSON.stringify(values),
    });
    if (res.ok) {
      onFinished?.();
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Task name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Task description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <select {...field}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {collectionId === undefined && (
          <FormField
            control={form.control}
            name="collectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection</FormLabel>
                <FormControl>
                  <select {...field}>
                    <option value="">No collection</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="submit" size="icon">
              {task ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{task ? "Update task" : "Create task"}</p>
          </TooltipContent>
        </Tooltip>
      </form>
    </Form>
  );
}

type TaskFormDialogProps = {
  task?: Task;
  collections: Collection[];
  children: React.ReactNode;
  collectionId?: string;
};

export function TaskFormDialog({ task, collections, children, collectionId }: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? "Edit" : "Create"} Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          task={task}
          collections={collections}
          onFinished={() => setOpen(false)}
          collectionId={collectionId}
        />
      </DialogContent>
    </Dialog>
  );
}
