import { Client, PrivateKey, TopicCreateTransaction } from "@hashgraph/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const client = Client.forTestnet();

    client.setOperator("", "");

    const transaction = new TopicCreateTransaction();
    const submitTx = await transaction.execute(client);

    const receipt = await submitTx.getReceipt(client);
    const topicId = receipt.topicId.toString();

    return NextResponse.json({ topicId });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json(
      { error: "Error creating topic" },
      { status: 500 }
    );
  }
}
