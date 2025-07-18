import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [typingStatus, setTypingStatus] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("userTyping", ({ username, status }) => {
      setTypingStatus(status ? `${username} is typing...` : "");
    });

    socket.on("userConnected", (user) => {
      setMessages((prev) => [...prev, { message: `${user} joined`, username: "System" }]);
    });

    socket.on("userDisconnected", (user) => {
      setMessages((prev) => [...prev, { message: `${user} left`, username: "System" }]);
    });
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
      socket.emit("typing", false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", true);
    setTimeout(() => socket.emit("typing", false), 1000);
  };

  const setUser = () => {
    if (username.trim()) {
      socket.emit("setUsername", username);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {!username ? (
        <div>
          <h2>Enter Username</h2>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
          <button onClick={setUser}>Join</button>
        </div>
      ) : (
        <>
          <h2>Welcome, {username}</h2>
          <div style={{ border: "1px solid #ccc", height: 300, overflowY: "scroll", padding: 10 }}>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.username}:</strong> {msg.message}{" "}
                <small>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}</small>
              </div>
            ))}
          </div>
          <p>{typingStatus}</p>
          <input value={message} onChange={handleTyping} placeholder="Type a message" />
          <button onClick={handleSend}>Send</button>
        </>
      )}
    </div>
  );
};

export default App;