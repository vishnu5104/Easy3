"use client";

import React, { useState } from "react";

const HedraCS = () => {
  const [topicId, setTopicId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const createTopic = async () => {
    setLoading(true);
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
      }
    } catch (error) {
      console.error("Error in request:", error);
    }
    setLoading(false);
  };

  const submitMessage = async () => {
    if (!topicId || !message) return;

    setLoading(true);
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
        setTransactionId(data.transactionId); // Store the transaction ID
      } else {
        console.error("Error submitting message:", data.error);
      }
    } catch (error) {
      console.error("Error in request:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Hedera Consensus Service</h1>
      <button onClick={createTopic} disabled={loading}>
        {loading ? "Creating Topic..." : "Create Topic"}
      </button>

      {topicId && (
        <div>
          <h2>Topic Created:</h2>
          <p>Topic ID: {topicId}</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button onClick={submitMessage} disabled={loading}>
            {loading ? "Submitting Message..." : "Submit Message"}
          </button>
          {messageStatus && <p>{messageStatus}</p>}
          {transactionId && (
            <div>
              <h3>Transaction ID:</h3>
              <p>{transactionId}</p>

              <p>
                View Here Transaction{" "}
                {`https://explorer.arkhia.io/testnet/transaction/${transactionId}`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HedraCS;
