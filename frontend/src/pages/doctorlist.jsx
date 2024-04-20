import React, { useState } from "react";
import ChatDialog from "../components/chatdialog";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
function DoctorList() {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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
    { field: "doctorName", headerName: "Doctor Name", width: 200 },
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

        <ChatDialog
          open={chatOpen}
          onClose={handleChatClose}
          doctor={selectedDoctor}
        />
      </Box>
    </Box>
  );
}
export default DoctorList;
