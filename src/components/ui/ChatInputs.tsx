import React from "react";
import { Button } from "./button";
import { Input } from "./input";

const ChatInputs = ({
  sendMessage,
  currentMessage,
  setCurrentMessage,
}: {
  sendMessage: () => void;
  currentMessage: string;
  setCurrentMessage: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
        placeholder="Write a message…"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={!currentMessage.trim()}>
        Send
      </Button>
    </form>
  );
};

export default ChatInputs;
