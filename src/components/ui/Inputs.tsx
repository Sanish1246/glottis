import React, { useState } from "react";
import { Button } from "./button";

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
    <div className="flex flex-row gap-2 justify-center mt-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="border-2 border-gray-300 p-2 rounded-md w-[60%]"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <Button onClick={() => sendMessage()}>Send</Button>
    </div>
  );
};

export default Inputs;
