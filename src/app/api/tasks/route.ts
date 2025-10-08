import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const tasks = await prisma.task.findMany();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { name, description, priority, collectionId } = await request.json();
  const task = await prisma.task.create({
    data: {
      name,
      description,
      priority,
      collectionId,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
