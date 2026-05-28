import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

// Connect to backend
const socket = io("http://vfpjdp1tdt52fh898jsae6ae.178.105.39.91.sslip.io");

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Load old messages
    socket.on("load_messages", (data) => {
      setMessages(data);
    });

    // Receive live messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("load_messages");
      socket.off("receive_message");
    };
  }, []);

  // Send message
  const sendMessage = () => {
    if (!text || !username) return;

    const messageData = {
      username,
      text,
    };

    socket.emit("send_message", messageData);

    setText("");
  };

  return (
    <div className="app">
      <h1>💬 Realtime Chat App</h1>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.username}</strong>
            <span> ({msg.time})</span>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          type="text"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
