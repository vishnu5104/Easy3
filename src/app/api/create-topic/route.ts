import { Client, PrivateKey, TopicCreateTransaction } from "@hashgraph/sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const client = Client.forTestnet();

    client.setOperator(
      "0.0.4835481",
      "3030020100300706052b8104000a04220420f5a83c4caf5f77f77ae7bf84c639c8ee5c353f4dd344e6534972fe2afd57796e"
    );

    const transaction = new TopicCreateTransaction();
    const submitTx = await transaction.execute(client);

    const receipt = await submitTx.getReceipt(client);
    const topicId = receipt.topicId.toString();

    return NextResponse.json({ topicId });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
