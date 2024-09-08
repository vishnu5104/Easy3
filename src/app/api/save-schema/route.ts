import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { schemaId } = await request.json();

    if (!schemaId) {
      return NextResponse.json(
        { error: "SchemaId is missing" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "schema.json");

    // Initialize schemaIds array
    let schemaIds = [];
    try {
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf-8");
        schemaIds = JSON.parse(fileData);
      }
    } catch (readError) {
      console.error("Error reading or parsing schemaIds.json:", readError);
      // Optionally, initialize schemaIds as an empty array if the file read fails
    }

    // Add the new schemaId
    schemaIds.push({ schemaId, timestamp: new Date().toISOString() });

    // Save the updated data back to the JSON file
    try {
      fs.writeFileSync(filePath, JSON.stringify(schemaIds, null, 2), "utf-8");
    } catch (writeError) {
      console.error("Error writing to schemaIds.json:", writeError);
    }

    return NextResponse.json({ message: "SchemaId saved successfully" });
  } catch (error) {
    console.error("Error saving schemaId:", error);
    return NextResponse.json(
      { error: "Failed to save schemaId" },
      { status: 500 }
    );
  }
}
