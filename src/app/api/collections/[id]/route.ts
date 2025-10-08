import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { name } = await request.json();
  const collection = await prisma.collection.update({
    where: { id: params.id },
    data: { name },
  });
  return NextResponse.json(collection);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.collection.delete({
    where: { id: params.id },
  });
  return new NextResponse(null, { status: 204 });
}
