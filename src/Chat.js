import React, { useState, useRef } from "react";
import WebSocket from "react-websocket";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const wsProtocol = window.location.protocol === "https:" ? "wss" : "wss";
  const wsUrl = `${wsProtocol}://5h8ptm77-8000.use.devtunnels.ms/ws/chat/temp/`; // Replace with your WebSocket server URL

  const websocketRef = useRef(null); // Create a ref for the WebSocket component
  const handleData = (data) => {
    const messageData = JSON.parse(data);
    setMessages((prevMessages) => [...prevMessages, messageData]);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    const messageData = { message, sender: "YourUsername" }; // Replace with the sender's username
    websocketRef.current.sendMessage(JSON.stringify(messageData));
    setMessage("");
  };

  return (
    <div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={handleMessageChange}
      />
      <button onClick={sendMessage}>Send</button>
      <WebSocket
        url={wsUrl}
        onMessage={handleData}
        reconnect={true}
        debug={true}
        ref={websocketRef} // Assign the ref to the WebSocket component
      />
    </div>
  );
}

export default Chat;
