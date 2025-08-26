import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.products.findMany();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("API Error:", error);  // <-- เพิ่ม log นี้ดู error จริง
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, price, image } = body ?? {};

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ message: 'name is required' }, { status: 400 });
    }
    if (price === undefined || Number.isNaN(Number(price))) {
      return NextResponse.json({ message: 'price must be a number' }, { status: 400 });
    }
    if (!image || typeof image !== 'string') {
      return NextResponse.json({ message: 'image is required' }, { status: 400 });
    }

    const created = await prisma.products.create({
      data: {
        name,
        description: description ?? null,
        category: category ?? null,
        price: Number(price),
        image,
      },
    });

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: String(error) },
      { status: 500 }
    );
  }
}