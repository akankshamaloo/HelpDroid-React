import React, { useState, useEffect } from "react";
import ChatComponent from "../components/chatdialog";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Drawer, Dialog } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download"; // Replace with your actual download icon
import TimelineIcon from "@mui/icons-material/Timeline";
import Sidebar from "../components/Sidebar";
import { v4 as uuidv4 } from "uuid"; // Make sure to install uuid to generate unique IDs for each message
import io from "socket.io-client";
import axios from "axios";
import { toast } from "react-toastify";
import LineChartComponent from "../components/LineChartComponent";

function DoctorList() {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(
    sessionStorage.getItem("user_id")
  );
  const [chartDialogOpen, setChartDialogOpen] = useState(false);

  const [role, setRole] = useState("" + sessionStorage.getItem("role"));
  // Function to handle the sending of messages
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleDownload = () => {
    // Query for the specific svg element if there are multiple SVGs on the page.
    const svg = document.querySelector(".recharts-surface");
    if (svg) {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);

      // Add namespaces.
      if (source.indexOf('xmlns="http://www.w3.org/2000/svg"') === -1) {
        source = source.replace(
          "<svg",
          '<svg xmlns="http://www.w3.org/2000/svg"'
        );
      }
      if (source.indexOf('xmlns:xlink="http://www.w3.org/1999/xlink"') === -1) {
        source = source.replace(
          "<svg",
          '<svg xmlns:xlink="http://www.w3.org/1999/xlink"'
        );
      }

      // Add xml declaration
      const xml = '<?xml version="1.0" standalone="no"?>\r\n' + source;

      // Convert SVG source to URI data scheme.
      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);

      // Create a download link element
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "chart.svg"; // File name here
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      console.error("Could not find the SVG chart element for downloading.");
    }
  };

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
  const handleChartDialogOpen = () => {
    setChartDialogOpen(true);
  };

  const handleChartDialogClose = () => {
    setChartDialogOpen(false);
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
    {
      field: "gender",
      headerName: "Gender",
      width: 200,
    },
    ...(role == "true"
      ? []
      : [
          { field: "specialization", headerName: "Specialization", width: 200 },
        ]),
    ...(role == "false"
      ? [{ field: "fees", headerName: "Fees Charged", width: 150 }]
      : []),
    ...(role == "false"
      ? [
          {
            field: "experience",
            headerName: "Years Of Experience",
            width: 150,
          },
        ]
      : []),
    ...(role == "true"
      ? [
          {
            field: "showGraph",
            headerName: "Show Graph",
            width: 130,
            renderCell: (params) => (
              <IconButton onClick={handleChartDialogOpen}>
                <TimelineIcon style={{ color: "white" }} />{" "}
                {/* Replace with your actual graph icon */}
              </IconButton>
            ),
          },
        ]
      : []),
    ,
    { field: "mobile", headerName: "Contact Number", width: 150 },
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
        <Dialog open={chartDialogOpen} onClose={handleChartDialogClose}>
          <Box sx={{ position: "relative", width: "auto", height: "auto" }}>
            <LineChartComponent />{" "}
            {/* Placeholder for your line chart component */}
            <IconButton
              onClick={handleDownload} // You need to define this function to handle the download logic
              sx={{ position: "absolute", right: 0, top: 0 }}
            >
              <DownloadIcon />
            </IconButton>
          </Box>
        </Dialog>
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
