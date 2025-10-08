import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const collections = await prisma.collection.findMany();
  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const collection = await prisma.collection.create({
    data: {
      name,
    },
  });
  return NextResponse.json(collection, { status: 201 });
}
