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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collection, Task } from "@prisma/client";

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
        <Button type="submit" className="w-full text-white">Create Collection</Button>
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
  onFinished?: () => void;
  collectionId?: string;
};

export function TaskForm({ task, onFinished, collectionId }: TaskFormProps) {
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
          <Select
            value={field.value}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger>
            <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
        )}
      />
      <Button type="submit" className="w-full text-white">
        {task ? "Update task" : "Create task"}
      </Button>
      </form>
    </Form>
  );
}

type TaskFormDialogProps = {
  task?: Task;
  children: React.ReactNode;
  collectionId?: string;
};

export function TaskFormDialog({ task, children, collectionId }: TaskFormDialogProps) {
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
          onFinished={() => setOpen(false)}
          collectionId={collectionId}
        />
      </DialogContent>
    </Dialog>
  );
}
