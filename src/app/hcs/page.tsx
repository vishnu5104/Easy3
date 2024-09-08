"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, Plus, ExternalLink } from "lucide-react";

type CommandResult = {
  command: string;
  result: string;
};

const commands = [
  "/sendAsset <assetAddress> <receiverAddress>",
  "/sendToken <receiverAddress> <amount>",
  "/sendNFT <tokenId> <receiverAddress>",
  "/sendReward <walletAddress> <amount>",
];

export default function HedraCSCommandSuggester() {
  const [topicId, setTopicId] = useState<string | null>(null);
  const [createTopicLoading, setCreateTopicLoading] = useState(false);
  const [submitMessageLoading, setSubmitMessageLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [history, setHistory] = useState<CommandResult[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (input.startsWith("/")) {
      const matchedSuggestions = commands.filter((cmd) =>
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(matchedSuggestions);
      setSelectedSuggestion(-1);
    } else {
      setSuggestions([]);
    }
  }, [input]);

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
        toast({
          title: "Topic Created",
          description: `Topic ID: ${data.topicId}`,
        });
      } else {
        console.error("Error creating topic:", data.error);
        setMessageStatus(`Error creating topic: ${data.error}`);
        toast({
          title: "Error",
          description: `Failed to create topic: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in request:", error);
      setMessageStatus("Error in request. Please try again.");
      toast({
        title: "Error",
        description: "Failed to create topic. Please try again.",
        variant: "destructive",
      });
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
        setMessage("");
        toast({
          title: "Message Submitted",
          description: `Transaction ID: ${data.transactionId}`,
        });
      } else {
        console.error("Error submitting message:", data.error);
        setMessageStatus(`Error submitting message: ${data.error}`);
        toast({
          title: "Error",
          description: `Failed to submit message: ${data.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in request:", error);
      setMessageStatus("Error in request. Please try again.");
      toast({
        title: "Error",
        description: "Failed to submit message. Please try again.",
        variant: "destructive",
      });
    }
    setSubmitMessageLoading(false);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    let result = "Command executed successfully.";

    const [command, ...args] = trimmedInput.split(" ");

    switch (command.toLowerCase()) {
      case "/sendasset":
        if (args.length === 2) {
          result = `Sending asset ${args[0]} to ${args[1]}...`;
          // Implement actual asset sending logic here
        } else {
          result = "Usage: /sendAsset <assetAddress> <receiverAddress>";
        }
        break;
      case "/sendtoken":
        if (args.length === 2) {
          result = `Sending token to ${args[0]} with amount ${args[1]}...`;
          // Implement actual token sending logic here
        } else {
          result = "Usage: /sendToken <receiverAddress> <amount>";
        }
        break;
      case "/sendnft":
        if (args.length === 2) {
          result = `Sending NFT ${args[0]} to ${args[1]}...`;
          // Implement actual NFT sending logic here
        } else {
          result = "Usage: /sendNFT <tokenId> <receiverAddress>";
        }
        break;
      case "/sendreward":
        if (args.length === 2) {
          result = `Sending reward to ${args[0]} with amount ${args[1]}...`;
          // Implement actual reward sending logic here
        } else {
          result = "Usage: /sendReward <walletAddress> <amount>";
        }
        break;
      default:
        result =
          "Invalid command. Try /sendAsset, /sendToken, /sendNFT, or /sendReward.";
    }

    setHistory([...history, { command: trimmedInput, result }]);
    setInput("");
    setMessage(trimmedInput);
    toast({
      title: "Command Executed",
      description: result,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (selectedSuggestion !== -1) {
        setInput(suggestions[selectedSuggestion]);
      } else if (suggestions.length > 0) {
        setInput(suggestions[0]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.startsWith("/")) {
      const matchedSuggestions = commands.filter((cmd) =>
        cmd.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
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
            <Button
              onClick={createTopic}
              disabled={createTopicLoading}
              className="w-full"
              variant="outline"
            >
              {createTopicLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {createTopicLoading ? "Creating Topic..." : "Create Topic"}
            </Button>
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
              <ScrollArea
                className="h-[200px] mb-4 p-4 border rounded-md"
                ref={scrollAreaRef}
              >
                {history.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-primary font-mono">{`> ${item.command}`}</p>
                    <p className="text-muted-foreground font-mono">
                      {item.result}
                    </p>
                  </div>
                ))}
              </ScrollArea>
              <form onSubmit={handleCommand} className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command (e.g., /sendToken)"
                  className="pr-20 font-mono"
                />
                <Button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0"
                  disabled={submitMessageLoading || !input}
                >
                  {submitMessageLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-popover border rounded-md mt-1 shadow-md">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className={`px-3 py-2 cursor-pointer ${
                          index === selectedSuggestion
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }`}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
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
