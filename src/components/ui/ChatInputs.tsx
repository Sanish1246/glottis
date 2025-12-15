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

const ChatInputs = ({ setMessages }: messageProp) => {
  const [newMessage, setNewMessage] = useState("");

  function sendMessage() {
    setMessages((prev: Message[]) => [
      ...prev,
      { id: prev.length + 1, text: newMessage, sender: "user" },
    ]);
    setNewMessage("");
    setMessages((prev: Message[]) => [
      ...prev,
      { id: prev.length + 1, text: "Test response", sender: "bot" },
    ]);

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
  }
};

export default ChatInputs;
