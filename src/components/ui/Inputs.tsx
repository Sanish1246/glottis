import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface Message {
  id: number;
  text: string;
  sender: string;
}

interface messageProp {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const Inputs = ({ setMessages }: messageProp) => {
  const [newMessage, setNewMessage] = useState("");

  async function sendMessage() {
    if (!newMessage.trim()) return;
    setMessages((prev: Message[]) => [
      ...prev,
      { id: prev.length + 1, text: newMessage, sender: "user" },
    ]);
    setNewMessage("");
    try {
      const response = await fetch("http://localhost:8000/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: newMessage }),
      });
      const data = await response.json();
      setMessages((prev: Message[]) => [
        ...prev,
        { id: prev.length + 1, text: data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <form
      className="flex flex-col gap-2 pt-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <Input
        type="text"
        placeholder="Ask Athena anything about your target language…"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!newMessage.trim()}>
        Send
      </Button>
    </form>
  );
};

export default Inputs;
