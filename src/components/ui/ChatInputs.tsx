import React, { useState } from "react";
import { Button } from "./button";

interface Message {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
}

interface messageProp {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatInputs = ({
  sendMessage,
  currentMessage,
  setCurrentMessage,
}: any) => {
  return (
    <div className="flex flex-row gap-2 justify-center mt-2">
      <input
        type="text"
        placeholder="Type your message..."
        className="border-2 border-gray-300 p-2 rounded-md w-[60%]"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <Button onClick={() => sendMessage()}>Send</Button>
    </div>
  );
};

export default ChatInputs;
