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
