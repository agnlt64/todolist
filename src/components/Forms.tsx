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
  name: z.string().min(1, "Le nom est requis"),
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
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la collection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-white">Créer la collection</Button>
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
            {collection ? "Modifier" : "Créer"} une collection
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
  name: z.string().min(1, "Le nom est requis"),
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
          <FormLabel>Nom</FormLabel>
          <FormControl>
          <Input placeholder="Nom de la tâche" {...field} />
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
          <Input placeholder="Description de la tâche" {...field} />
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
          <FormLabel>Priorité</FormLabel>
          <FormControl>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger>
            <SelectValue placeholder="Sélectionner une priorité" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="LOW">Basse</SelectItem>
            <SelectItem value="MEDIUM">Moyenne</SelectItem>
            <SelectItem value="HIGH">Haute</SelectItem>
            </SelectContent>
          </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
        )}
      />
      <Button type="submit" className="w-full text-white">
        {task ? "Mettre à jour la tâche" : "Créer la tâche"}
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
          <DialogTitle>{task ? "Modifier" : "Créer"} une tâche</DialogTitle>
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
