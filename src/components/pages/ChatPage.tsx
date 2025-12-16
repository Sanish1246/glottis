import { useState } from "react";
import Inputs from "../ui/Inputs";
import { Button } from "../ui/button";
import io from "socket.io-client";

const socket = io.socket("http://localhost:3000");

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "How can I help you today?", sender: "bot" },
  ]);
  return (
    <div>
      <div>
        <div className=" h-[35rem] flex flex-col overflow-y-auto">
          {/* Applying different formatting based on who sends the message */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mt-2 rounded-md border-2 max-w-[80%] w-fit ${
                msg.sender === "user"
                  ? "self-end mr-5 bg-user-msg"
                  : "self-start bg-bot-msg text-msg-text text-left ml-5"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>
      <Inputs setMessages={setMessages} />
    </div>
  );
};

export default ChatPage;
