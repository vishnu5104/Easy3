import { NextResponse } from "next/server";
import { getContractTemplate } from "../../../../utils/readContract";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  const symbol = url.searchParams.get("symbol");

  if (typeof name === "string" && typeof symbol === "string") {
    try {
      const template = getContractTemplate(name, symbol);

      return new NextResponse(template, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    } catch (error) {
      console.error("Error generating contract template:", error);
      return new NextResponse("Error generating contract template", {
        status: 500,
      });
    }
  } else {
    return new NextResponse("Invalid query parameters", {
      status: 400,
    });
  }
}
