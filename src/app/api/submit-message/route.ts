import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
} from "@hashgraph/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topicId, message } = body;

    const client = Client.forTestnet();

    client.setOperator("", "");

    if (message) {
      const { status, transactionId } = await submitMessageToTopic(
        client,
        topicId,
        message
      );
      return NextResponse.json({
        status: `Message submission status: ${status}`,
        transactionId,
      });
    } else {
      const transaction = new TopicCreateTransaction();
      const submitTx = await transaction.execute(client);

      const receipt = await submitTx.getReceipt(client);
      const newTopicId = receipt.topicId.toString();

      return NextResponse.json({ topicId: newTopicId });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}

async function submitMessageToTopic(
  client: Client,
  topicId: string,
  message: string
): Promise<{ status: string; transactionId: string }> {
  const transaction = new TopicMessageSubmitTransaction({
    topicId: TopicId.fromString(topicId),
    message: message,
  });

  const submitTx = await transaction.execute(client);

  const receipt = await submitTx.getReceipt(client);
  const status = receipt.status.toString();
  const transactionId = submitTx.transactionId.toString();

  return { status, transactionId };
}
