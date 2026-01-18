import { useState, useEffect, useMemo } from "react";
import ChatInputs from "../ui/ChatInputs";
import io, { Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import dayjs from "dayjs";

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
  const [splitDate, setSplitDate] = useState("00-00-0000");

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
        console.log(data);
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
    console.log(room);
    if (!room) return;

    getMessages();

    // Join the room
    socket.emit("join_room", room);
    console.log(`Joined room: ${room}`);

    // Listen for incoming messages
    const handleReceiveMessage = (data: ChatMessage) => {
      console.log("Message received:", data);
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

    console.log("Sending message:", messageData);

    // Emit to server — don't add to state here
    socket.emit("send_message", messageData);

    // Clear input immediately for better UX
    setCurrentMessage("");

    // The server will broadcast this back via receive_message
    // so it will be added to state there (avoiding duplicates)
  };

  return (
    <div>
      <div className="flex flex-row items-center">
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
        <h1>Chat with {username}</h1>
      </div>

      <div>
        <div className=" h-[35rem] flex flex-col overflow-y-auto">
          {/* Applying different formatting based on who sends the message */}
          {messages.map((msg, index: number) => (
            <>
              {msg.date == dayjs(Date.now()).format("DD-MM-YYYY") ? (
                <p className=" w-[5%] text-center border-2 p-1 mx-auto text-sm rounded-lg">
                  Today
                </p>
              ) : null}
              {/* {msg.date > splitDate ? (<p>{msg.date}</p>
              setSplitDate(msg.date)) : null} */}
              <div
                key={index}
                className={`mt-2 rounded-md border-2 w-fit ${
                  msg.sender === currentUser
                    ? "self-end mr-5 bg-user-msg"
                    : "self-start bg-bot-msg text-msg-text text-left ml-5"
                }`}
              >
                <p>{msg.content}</p>
                <p>{msg.timestamp}</p>
              </div>
            </>
          ))}
        </div>
      </div>
      <ChatInputs
        sendMessage={sendMessage}
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
      />
    </div>
  );
};

export default ChatPage;
