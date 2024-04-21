import React, { useState, useEffect } from "react";
import ChatComponent from "../components/chatdialog";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Drawer } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { v4 as uuidv4 } from "uuid"; // Make sure to install uuid to generate unique IDs for each message
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
function DoctorList() {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  // Function to handle the sending of messages
  const fetchDoctorsData = async () => {
    try {
      axios
        .post("http://localhost:5000/get-doctors", {
          role: sessionStorage.getItem("role"),
          email: sessionStorage.getItem("user_email"),
        })
        .then((response) => {
          if (response.status === 200) {
            console.log(response, "");
            setDoctors(response?.data?.doctors); // Assuming the JSON response is structured as { doctors: [] }
          } else {
            toast.error("Error in fetching Doctors");
          }
        })
        .catch((err) => {
          console.log(err);
        }); // Replace with your actual API endpoint
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    fetchDoctorsData();
    // Connect to the SocketIO server
    const newSocket = io("http://localhost:5000");

    newSocket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      newSocket.close();
    };
  }, []);
  const handleSendMessage = (message, sender) => {
    console.log("Send message:", message);
    // setMessages([
    //   ...messages,
    //   {
    //     text: message,
    //     timestamp: new Date().toLocaleTimeString(),
    //     sender: sender,
    //   },
    // ]);
    const messageToSend = {
      type: "message",
      //   id: uuidv4(), // Generate a unique ID for each message
      text: message,
      sender: sessionStorage.getItem("user_id"),
      timestamp: new Date().toLocaleTimeString(),
    };

    // Send the message to the WebSocket server
    socket.emit("send_message", messageToSend);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };
  const handleChatOpen = (doctor) => {
    setSelectedDoctor(doctor);
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      doctorName: "Dr. Smith",
      specialization: "Cardiology",
      contact: "123-456-7890",
    },
    // ... more doctors
  ]);

  const columns = [
    { field: "id", headerName: "Id", width: 100 },
    { field: "name", headerName: "Doctor Name", width: 200 },
    { field: "specialization", headerName: "Specialization", width: 200 },
    { field: "contact", headerName: "Contact Number", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleChatOpen(params.row)}>
          <ChatIcon style={{ color: "white" }} />
        </IconButton>
      ),
    },
  ];
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar OpenSidebar={true} />
      <Box sx={{ flexGrow: 1, padding: "1rem", overflow: "auto" }}>
        <DataGrid
          rows={doctors}
          columns={columns.map((column) => ({
            ...column,
            headerAlign: "center", // This aligns the header text to the center
          }))}
          pageSize={5}
          sx={{
            "& .MuiDataGrid-cell": {
              color: "white",
            },
            "& .MuiTablePagination-root": {
              color: "white",
            },
            ".MuiDataGrid-root .MuiDataGrid-cell": {
              color: "white", // This specifically changes the text color of the cells
            },
            "& .MuiDataGrid-cell": {
              textAlign: "center", // Centers the text in cells
              display: "flex",
              alignItems: "center", // Vertically center the content in cells
              justifyContent: "center",
              color: "white",
              // Horizontally center the content in cells
            },
          }}
        />

        <Drawer
          anchor="right"
          open={chatOpen}
          onClose={toggleChat}
          variant="persistent"
          sx={{
            width: 320,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 320,
              boxSizing: "border-box",
              backgroundColor: "#fff", // Or any other background color you prefer
            },
          }}
        >
          <ChatComponent
            onSendMessage={handleSendMessage}
            messages={messages}
            userName={"YourUsername"}
          />
        </Drawer>
      </Box>
    </Box>
  );
}
export default DoctorList;
