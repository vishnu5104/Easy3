// app/api/create-marketplace/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, subdomain } = await request.json();

    if (!name || !subdomain) {
      return NextResponse.json(
        { error: "Name and subdomain are required" },
        { status: 400 }
      );
    }

    const existingmarketplace = await prisma.marketplace.findUnique({
      where: { subdomain },
    });

    if (existingmarketplace) {
      return NextResponse.json(
        { error: "Subdomain already exists" },
        { status: 409 }
      );
    }

    const newmarketplace = await prisma.marketplace.create({
      data: { name, subdomain },
    });

    return NextResponse.json(newmarketplace, { status: 201 });
  } catch (error) {
    console.error("Error creating marketplace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
