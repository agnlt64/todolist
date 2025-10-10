import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(request: Request, {params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  await prisma.collection.delete({
    where: { id },
  });
  return new NextResponse(null, { status: 204 });
}
