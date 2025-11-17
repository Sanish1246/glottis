import { useState } from "react";
import Inputs from "../ui/Inputs";
import QrCode from "../ui/QrCode";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";

const Athena = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "How can I help you today?", sender: "bot" },
  ]);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="text-extrabold text-3xl">Athena</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#25D366] hover:bg-[#068936]">
              <MessageCircle /> Use on Whatsapp
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chat on Whatsapp</DialogTitle>
            </DialogHeader>
            <QrCode />
          </DialogContent>
        </Dialog>
      </div>

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
              {/* Formatting the answer by the bot using ReactMarkdown to support markdown syntax */}
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
      <Inputs setMessages={setMessages} />
    </div>
  );
};

export default Athena;
