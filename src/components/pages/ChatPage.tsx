import { useEffect, useMemo, useRef, useState } from "react";
import ChatInputs from "../ui/ChatInputs";
import io, { Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const socket: Socket = io("http://localhost:8000");

interface ChatMessage {
  room: string;
  sender: string;
  content: string;
  date: string;
  timestamp: string;
}

const ChatPage = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState("");
  const { state } = useLocation();

  const { username, currentUser } = state || {};
  const initialRoom = useMemo(() => {
    if (!username || !currentUser) return "";
    return username.localeCompare(currentUser) < 0
      ? `${username}&${currentUser}`
      : `${currentUser}&${username}`;
  }, [username, currentUser]);
  const [room, setRoom] = useState(initialRoom);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Keep view pinned to the latest message
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  useEffect(() => {
    const createChat = async () => {
      try {
        const response = await fetch(`http://localhost:8000/chat/${room}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        setMessages([]);
      } catch (error) {
        toast.error(String(error), {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    };
    const getMessages = async () => {
      try {
        const res = await fetch(`http://localhost:8000/chat/${room}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data) {
          setMessages(data.messages);
        } else {
          createChat();
        }
      } catch (error) {
        toast.error(String(error), {
          action: {
            label: "Close",
            onClick: () => {
              toast.dismiss();
            },
          },
        });
      }
    };

    if (username.localeCompare(currentUser) < 0) {
      setRoom(username + "&" + currentUser);
    } else {
      setRoom(currentUser + "&" + username);
    }
    if (!room) return;

    getMessages();

    // Join the room
    socket.emit("join_room", room);

    // Listen for incoming messages
    const handleReceiveMessage = (data: ChatMessage) => {
      setMessages((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [room, currentUser, username]);

  const sendMessage = async () => {
    if (currentMessage.trim() === "") return;

    const messageData: ChatMessage = {
      room: room,
      sender: currentUser,
      content: currentMessage,
      date: dayjs(Date.now()).format("DD-MM-YYYY"),
      timestamp: new Date(Date.now()).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      const res = await fetch(`http://localhost:8000/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(messageData),
      });
      // const data = await res.json();
      // setMessages(data.messages);
    } catch (error) {
      toast.error(String(error), {
        action: {
          label: "Close",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    }

    // Emit to server — don't add to state here
    socket.emit("send_message", messageData);

    // Clear input immediately for better UX
    setCurrentMessage("");

    // The server will broadcast this back via receive_message
    // so it will be added to state there (avoiding duplicates)
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-5xl flex-col gap-4 px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Chat</h1>
            <p className="text-sm text-muted-foreground">Chat with {username}</p>
          </div>
        </div>
      </div>

      <Card className="flex min-h-0 flex-1 flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{username}</CardTitle>
          <CardDescription className="text-xs">
            Messages are delivered in real time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col justify-between gap-3 pb-4">
          <div
            ref={scrollerRef}
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-lg bg-muted/40 p-3"
          >
            {messages.length === 0 && (
              <div className="my-auto text-center text-sm text-muted-foreground">
                No messages yet. Say hello.
              </div>
            )}

            {/* Applying different formatting based on who sends the message */}
            {messages.map((msg, index: number) => {
              const prev = messages[index - 1];
              const showDateChip = !prev || prev.date !== msg.date;
              const isToday = msg.date === dayjs(Date.now()).format("DD-MM-YYYY");
              return (
                <div key={`${msg.timestamp}-${index}`} className="space-y-2">
                  {showDateChip && (
                    <div className="flex justify-center">
                      <span className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {isToday ? "Today" : msg.date}
                      </span>
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      msg.sender === currentUser
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto border bg-background text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                    <p
                      className={`mt-1 text-[11px] ${
                        msg.sender === currentUser
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <ChatInputs
            sendMessage={sendMessage}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
