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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

const Athena = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "How can I help you today?", sender: "bot" },
  ]);

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-5xl flex-col gap-4 px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Athena</h1>
          <p className="text-sm text-muted-foreground">
            Your AI language tutor. Ask questions, get explanations, and practice freely.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#068936]">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Use on WhatsApp</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chat on WhatsApp</DialogTitle>
            </DialogHeader>
            <div className="mx-auto flex flex-col items-center gap-2 py-2">
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code with your phone to continue the conversation on WhatsApp.
              </p>
              <QrCode />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chat card */}
      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Chat</CardTitle>
          <CardDescription className="text-xs">
            Athena understands natural language and can answer grammar, vocabulary, and usage questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col justify-between gap-3 pb-4">
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-lg bg-muted/40 p-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  msg.sender === "user"
                    ? "self-end bg-primary text-primary-foreground"
                    : "self-start bg-background text-foreground border"
                }`}
              >
                <div className="[&_p]:m-0 [&_ul]:mt-1 [&_ul]:pl-4 [&_li]:text-xs [&_li]:leading-relaxed [&_a]:underline [&_a]:underline-offset-4">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <Inputs setMessages={setMessages} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Athena;
