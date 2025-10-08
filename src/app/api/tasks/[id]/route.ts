import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { name, description, priority, isDone, collectionId } = await request.json();
  const data: any = { name, description, priority, collectionId };
  if (isDone !== undefined) {
    data.isDone = isDone;
    data.doneAt = isDone ? new Date() : null;
  }
  const task = await prisma.task.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(task);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.task.delete({
    where: { id: params.id },
  });
  return new NextResponse(null, { status: 204 });
}
