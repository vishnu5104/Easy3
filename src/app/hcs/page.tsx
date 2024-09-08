"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Plus, ExternalLink } from "lucide-react";

export default function HedraCS() {
  const [topicId, setTopicId] = useState<string | null>(null);
  const [createTopicLoading, setCreateTopicLoading] = useState(false);
  const [submitMessageLoading, setSubmitMessageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const createTopic = async () => {
    setCreateTopicLoading(true);
    try {
      const response = await fetch("/api/create-topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTopicId(data.topicId);
      } else {
        console.error("Error creating topic:", data.error);
        setMessageStatus(`Error creating topic: ${data.error}`);
      }
    } catch (error) {
      console.error("Error in request:", error);
      setMessageStatus("Error in request. Please try again.");
    }
    setCreateTopicLoading(false);
  };

  const submitMessage = async () => {
    if (!topicId || !message) return;

    setSubmitMessageLoading(true);
    try {
      const response = await fetch("/api/submit-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topicId, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageStatus(`Message submission status: ${data.status}`);
        setTransactionId(data.transactionId);
        setMessage(""); // Clear the message input after successful submission
      } else {
        console.error("Error submitting message:", data.error);
        setMessageStatus(`Error submitting message: ${data.error}`);
      }
    } catch (error) {
      console.error("Error in request:", error);
      setMessageStatus("Error in request. Please try again.");
    }
    setSubmitMessageLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Hedera Consensus Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <button
              onClick={createTopic}
              disabled={createTopicLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createTopicLoading ? (
                <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="inline-block mr-2 h-4 w-4" />
              )}
              {createTopicLoading ? "Creating Topic..." : "Create Topic"}
            </button>
          </CardContent>
        </Card>

        {topicId && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Topic Created
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="topicId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Topic ID
                </label>
                <Input id="topicId" value={topicId} readOnly />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here"
                  rows={4}
                />
              </div>
              <button
                onClick={submitMessage}
                disabled={submitMessageLoading || !message}
                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMessageLoading ? (
                  <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="inline-block mr-2 h-4 w-4" />
                )}
                {submitMessageLoading
                  ? "Submitting Message..."
                  : "Submit Message"}
              </button>
              {messageStatus && (
                <p className="text-sm text-green-600 mt-2">{messageStatus}</p>
              )}
              {transactionId && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">
                    Transaction ID:
                  </h3>
                  <p className="text-sm break-all mb-2">{transactionId}</p>
                  <a
                    href={`https://explorer.arkhia.io/testnet/transaction/${transactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    View Transaction
                    <ExternalLink className="inline-block ml-1 h-4 w-4" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
