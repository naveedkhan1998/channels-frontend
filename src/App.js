import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { TextField, Button, Typography, Container, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const styles = {
  container: {
    background: "#f0f0f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  paper: {
    padding: "20px",
    marginBottom: "20px",
    width: "100%",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    background: "linear-gradient(to bottom, #87CEEB, #5F9EA0)",
  },
  chatLog: {
    height: "300px",
    overflowY: "scroll",
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.8)",
  },
  chatInput: {
    display: "flex",
    padding: "10px",
  },
  messageInput: {
    flex: 1,
  },
  sendButton: {
    marginLeft: "10px",
  },
};

function App() {
  const [userName, setUserName] = useState(" ");
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState("");
  const messageInputRef = useRef(null);
  const chatLogRef = useRef(null); // Add a ref for the chat log container
  const chatTextAreaRef = useRef(null); // Add a ref for the textarea
  const roomName = "temp";
  const wsUrl = `wss://5h8ptm77-8000.use.devtunnels.ms/ws/chat/${roomName}/`;

  useEffect(() => {
    const chatSocket = new WebSocket(wsUrl);

    chatSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChatLog((prevLog) => [...prevLog, data]);

      // Auto-scroll to the bottom of the chat log
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
      // Auto-scroll to the bottom of the textarea
      chatTextAreaRef.current.scrollTop = chatTextAreaRef.current.scrollHeight;
    };

    chatSocket.onclose = (event) => {
      console.error("Chat socket closed unexpectedly", event);
    };

    return () => {
      chatSocket.close();
    };
  }, [wsUrl]);

  const handleSendMessage = () => {
    if (userName && message) {
      const messageData = {
        message,
        sender: userName,
      };

      const chatSocket = new WebSocket(wsUrl);
      chatSocket.onopen = () => {
        chatSocket.send(JSON.stringify(messageData));
        chatSocket.close();
      };

      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default newline behavior

      if (userName && message) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="App">
      <Container style={styles.container}>
        <Paper style={styles.paper}>
          <div className="user-name-form">
            <TextField
              label="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
            {userName && (
              <Typography variant="h6">User Name: {userName}</Typography>
            )}
          </div>
          <div style={styles.chatLog} ref={chatLogRef}>
            <Typography variant="h5">Chat Log</Typography>
            <textarea
              sx={{ overflowY: "scroll" }}
              value={chatLog
                .map((entry) => entry.user + ": " + entry.message)
                .join("\n")}
              readOnly
              style={{ width: "100%", height: "80%" }}
              ref={chatTextAreaRef} // Add a ref for the textarea
            />
          </div>
          <div style={styles.chatInput}>
            <TextField
              label="Type your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.messageInput}
              fullWidth
              inputRef={messageInputRef}
              onKeyDown={handleKeyDown}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              style={styles.sendButton}
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
}

export default App;
