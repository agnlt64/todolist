import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type TaskUpdateRequest = {
  name?: string;
  description?: string | null;
  priority?: number;
  isDone?: boolean;
  doneAt?: Date | null;
  collectionId?: string | null;
};

export async function PATCH(request: Request, {params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const { name, description, priority, isDone, collectionId } = await request.json();
  const data: TaskUpdateRequest = { name, description, priority, collectionId };
  if (isDone !== undefined) {
    data.isDone = isDone;
    data.doneAt = isDone ? new Date() : null;
  }
  const task = await prisma.task.update({
    where: { id },
    data: data as any,
  });
  return NextResponse.json(task);
}

export async function DELETE(request: Request, {params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  await prisma.task.delete({
    where: { id },
  });
  return new NextResponse(null, { status: 204 });
}
