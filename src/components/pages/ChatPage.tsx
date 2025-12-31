import { useState, useEffect } from "react";
import ChatInputs from "../ui/ChatInputs";
import io, { Socket } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const socket: Socket = io("http://localhost:8000");

interface ChatMessage {
  room: string;
  sender: string;
  content: string;
  time: string;
}

const ChatPage = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState("");
  const { state } = useLocation();

  const { username, currentUser } = state || {};
  const [room, setRoom] = useState("TestRoom");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (username.localeCompare(currentUser) < 0) {
      setRoom(username + "&" + currentUser);
    } else {
      setRoom(currentUser + "&" + username);
    }
    if (!room) return;

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
      time: new Date(Date.now()).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

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
            <div
              key={index}
              className={`mt-2 rounded-md border-2 w-fit ${
                msg.sender === currentUser
                  ? "self-end mr-5 bg-user-msg"
                  : "self-start bg-bot-msg text-msg-text text-left ml-5"
              }`}
            >
              <p>{msg.content}</p>
              <p>{msg.time}</p>
            </div>
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
