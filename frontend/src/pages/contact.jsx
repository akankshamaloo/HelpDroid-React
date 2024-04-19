import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";

function ContactSchedule() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      mobile: "123-456-7890",
    },
    // ... more contacts
  ]);
  const [open, setOpen] = useState(false);
  const [contactData, setContactData] = useState({
    id: null,
    name: "",
    email: "",
    mobile: "",
  });

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{3}-\d{3}-\d{4}$/.test(phone);
  };

  const handleClickOpen = (contact) => {
    setContactData(contact);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setContactData({ id: null, name: "", email: "", mobile: "" });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleSave = () => {
    if (!validateEmail(contactData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(contactData.mobile)) {
      toast.error("Please enter a valid phone number (format: 123-456-7890).");
      return;
    }

    if (contactData.id) {
      setContacts(
        contacts.map((contact) =>
          contact.id === contactData.id ? contactData : contact
        )
      );
    } else {
      setContacts([...contacts, { ...contactData, id: contacts.length + 1 }]);
    }
    handleClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactData({ ...contactData, [name]: value });
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleClickOpen(params.row)}>
            <EditIcon style={{ color: "white" }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon style={{ color: "white" }} />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar OpenSidebar={true} />
      <Box sx={{ flexGrow: 1, padding: "1rem", overflow: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{ marginBottom: "10px" }}
        >
          Add Contact
        </Button>
        <DataGrid
          rows={contacts}
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {contactData.id ? "Edit Contact" : "Add Contact"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              type="text"
              fullWidth
              value={contactData.name}
              onChange={handleChange}
              disabled={contactData.id != null}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">👤</InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={contactData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">📧</InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              name="mobile"
              label="Mobile"
              type="text"
              fullWidth
              value={contactData.mobile}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">📱</InputAdornment>
                ),
              }}
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Box>
    </Box>
  );
}

export default ContactSchedule;
