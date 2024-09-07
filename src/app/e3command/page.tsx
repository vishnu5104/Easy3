"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

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

export default function EnhancedCommandSuggester() {
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
    if (input.startsWith("/s")) {
      const matchedSuggestions = commands.filter((cmd) =>
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(matchedSuggestions);
      setSelectedSuggestion(-1);
    } else {
      setSuggestions([]);
    }
  }, [input]);

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
    if (value.startsWith("/s")) {
      const matchedSuggestions = commands.filter((cmd) =>
        cmd.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Blockchain Command Center</h2>
      <ScrollArea
        className="h-[300px] mb-4 p-4 border rounded-md"
        ref={scrollAreaRef}
      >
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <p className="text-primary font-mono">{`> ${item.command}`}</p>
            <p className="text-muted-foreground font-mono">{item.result}</p>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleCommand} className="relative">
        <Input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter command (e.g., /sendAsset)"
          className="pr-20 font-mono"
        />
        <Button type="submit" className="absolute right-0 top-0 bottom-0">
          <Send className="h-4 w-4" />
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
    </div>
  );
}
