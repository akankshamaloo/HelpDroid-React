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
  const [currentUserId, setCurrentUserId] = useState(
    sessionStorage.getItem("user_id")
  );

  const [role, setRole] = useState("" + sessionStorage.getItem("role"));
  // Function to handle the sending of messages
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const fetchDoctorsData = async () => {
    try {
      axios
        .post("http://localhost:5000/get-doctors", {
          role: sessionStorage.getItem("role"),
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
    if (!selectedDoctor) {
      setMessages([]); // Clear messages if there's no selected doctor
      return;
    }

    const socket = io("http://localhost:5000");
    const room = getRoomName(currentUserId, selectedDoctor.id);

    // Join the chat room specific to the current user and selected doctor
    socket.emit("join", {
      sender_id: currentUserId,
      receiver_id: selectedDoctor.id,
    });

    // Listen for new messages in this room
    socket.on("receive_message", (message) => {
      // Add new messages only if they're meant for this chat
      if (
        message.sender_id === currentUserId &&
        message.receiver_id === selectedDoctor.id
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, is_sent: true },
        ]);
      } else if (
        message.receiver_id === currentUserId &&
        message.sender_id === selectedDoctor.id
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, is_sent: false },
        ]);
      }
    });

    setSocket(socket);

    // Clean up function when the component unmounts or when selectedDoctor changes
    return () => {
      socket.emit("leave", {
        sender_id: currentUserId,
        receiver_id: selectedDoctor.id,
      });
      socket.off("receive_message"); // Remove the event listener for receiving messages
      socket.disconnect(); // Disconnect from the socket
    };
  }, [selectedDoctor]); // This effect depends on selectedDoctor

  useEffect(() => {
    fetchDoctorsData();
    console.log(sessionStorage.getItem("role"));
  }, []);
  useEffect(() => {
    if (!selectedDoctor) return;
    axios
      .post("http://localhost:5000/get-messages", {
        sender_id: currentUserId,
        receiver_id: selectedDoctor?.id,
      })
      .then((res) => {
        console.log(res, "messages");
        setMessages(res?.data?.data);
      })
      .catch((err) => {
        toast.error("An unknown error occured");
      });
    setMessages([]);
  }, [selectedDoctor?.id]);

  const getRoomName = (user1, user2) => {
    // Sort the user IDs to ensure consistency
    return [user1, user2].sort().join("-");
  };

  const handleSendMessage = (text) => {
    const messageData = {
      text: text,
      sender_id: currentUserId,
      receiver_id: selectedDoctor?.id,
      timestamp: new Date().toISOString(),
    };
    socket.emit("send_message", messageData);
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
    { field: "id", headerName: "Id", width: 200 },
    {
      field: "name",
      headerName: role == "true" ? "Patient Name" : "Doctor Name",
      width: 200,
    },
    ...(role == "true"
      ? []
      : [
        { field: "specialization", headerName: "Specialization", width: 200 },
      ]),
    ...(role == "false"
      ? [
        { field: "fees", headerName: "Fees Charged", width: 150 },
      ]
      : []),
    ...(role == "false"
      ? [
        { field: "yearsOfExperience", headerName: "Years Of Experience", width: 150 },
      ]
      : []),

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
      <Sidebar OpenSidebar={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
            currentUser={sessionStorage.getItem("user_id")}
            receiverName={selectedDoctor?.name}
            onClose={handleChatClose}
          />
        </Drawer>
      </Box>
    </Box>
  );
}
export default DoctorList;
