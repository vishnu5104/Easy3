import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const subdomain = request.nextUrl.searchParams.get("subdomain");

  console.log("API: Received request for subdomain:", subdomain);

  if (!subdomain) {
    console.log("API: Subdomain is required");
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    //@ts-ignore
    const marketplace = await prisma.marketplace.findUnique({
      where: { subdomain },
      select: { id: true, name: true, subdomain: true },
    });

    console.log("API: marketplace found:", marketplace);

    if (!marketplace) {
      console.log("API: marketplace not found");
      return NextResponse.json(
        { error: "marketplace not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(marketplace);
  } catch (error) {
    console.error("API: Error fetching marketplace:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
