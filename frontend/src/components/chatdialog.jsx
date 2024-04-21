import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

const ChatComponent = ({
  onSendMessage,
  messages,
  currentUser,
  receiverName,
  onClose,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const bottomOfChat = useRef(null);

  const scrollToBottom = () => {
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, currentUser, receiverName); // Adjusted to pass receiver info
      setNewMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        bottom: 0,
        right: 0,
        width: 320, // Adjust the width as needed
        maxHeight: 400, // Adjust the height as needed
        overflow: "hidden",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chat with {receiverName}
          </Typography>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <List sx={{ overflowY: "auto", flexGrow: 1, px: 2, py: 1 }}>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            <ListItem
              alignItems="flex-start"
              sx={{
                justifyContent: message.is_sent ? "flex-end" : "flex-start", // Adjust alignment based on is_sent
              }}
            >
              <ListItemText
                primary={message.text}
                secondary={new Date(message.timestamp).toLocaleTimeString()}
                sx={{
                  wordBreak: "break-word",
                  maxWidth: "70%",
                  bgcolor: message.is_sent ? "#e0f2f1" : "#e3f2fd", // Background color also adjusted
                  borderRadius: "10px",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: message.is_sent ? "flex-end" : "flex-start", // Text alignment adjusted
                }}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
        <div ref={bottomOfChat} />
      </List>
      <Divider />
      <Box
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <TextField
          sx={{ ml: 1, flex: 1 }}
          placeholder="Type a message..."
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          sx={{ p: "10px" }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatComponent;
