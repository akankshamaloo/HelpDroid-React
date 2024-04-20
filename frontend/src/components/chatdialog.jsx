import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

function ChatDialog({ open, onClose, doctor }) {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, currentMessage]);
      setCurrentMessage("");
    }
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        Chat with {doctor?.doctorName}
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ padding: 2 }}>
        <div>
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <TextField
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Write a message..."
          fullWidth
          variant="outlined"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Box>
    </Dialog>
  );
}
export default ChatDialog;
