import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Box, Stack, Chip } from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

function AppointmentSchedule() {
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    time: dayjs(), // Initialize with current time as a dayjs object
    date: dayjs(), // Initialize with current date as a dayjs object
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments from the backend
        const response = await axios.post(
          "http://localhost:5000/get-appointments",
          {
            email: sessionStorage.getItem("user_email"),
          }
        );
        console.log(response);

        if (response.status === 200) {
          // Add unique IDs to each appointment
          const appointmentsWithIds = response.data.data.map((appointment) => ({
            ...appointment,
            id: uuidv4(),
          }));
          setRows(appointmentsWithIds);
          console.log(appointmentsWithIds);
        } else {
          toast.error(response.data.message || "Failed to fetch appointments.");
        }
      } catch (err) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, time: event.target.value });
  };

  const handleClickOpen = (row) => {
    console.log("row", row);
    setFormData({
      ...row,
      time: dayjs(row.time), // Ensure this is converted to dayjs object
      date: dayjs(row.date), // Ensure this is converted to dayjs object
      id: row.id,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      time: dayjs(),
      date: dayjs(),
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    setRows(rows.filter((row) => row.id !== id));
    try {
      const response = await axios.post(
        "http://localhost:5000/remove-appointment",
        {
          email: sessionStorage.getItem("user_email"),
          appointment: rows.filter((row) => row.id === id)[0].name,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        console.log("Appointment removed successfully");
        toast.success("Appointment removed successfully");
      } else {
        console.log("Failed to remove appointment");
        toast.error("Failed to remove appointment");
      }
    } catch (err) {}
  };

  const handleSave = async () => {
    const formattedTime = formData.time.format();
    const formattedDate = formData.date.format();
    console.log({
      email: sessionStorage.getItem("user_email"),
      appointment: formData.name,
      time: formattedTime,
      date: formattedDate,
    });
    if (formData.id) {
      setRows(
        rows?.map((row) => (row.id === formData.id ? { ...formData } : row))
      );
      try {
        const response = await axios.post(
          "http://localhost:5000/edit-appointment",
          {
            email: sessionStorage.getItem("user_email"),
            appointment: formData.name,
            time: formattedTime,
            date: formattedDate,
          }
        );
        if (response.status === 200) {
          console.log("Appointment updated successfully");
          toast.success("Appointment updated successfully");
        } else {
          console.log("Failed to update appointment");
          toast.error("Failed to update appointment");
        }
      } catch (err) {}
    } else {
      setRows([...rows, { ...formData, id: rows.length + 1 }]);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload-appointment",
          {
            email: sessionStorage.getItem("user_email"),
            appointment: formData.name,
            time: formattedTime,
            date: formattedDate,
          }
        );
        if (response.status === 200) {
          console.log("Appointment added successfully");
          toast.success("Appointment added successfully");
        } else {
          console.log("Failed to add appointment");
          toast.error("Failed to add appointment");
        }
      } catch (err) {}
    }

    handleClose();
  };

  const columns = [
    {
      field: "name",
      headerName: "Appointment Name",
      width: 200,
    },
    {
      field: "time",
      headerName: "Time",
      width: 150,
      renderCell: (params) => {
        // If time is a dayjs object or can be parsed by dayjs
        const formattedTime = dayjs(params.value).format("h:mm A");
        return <span>{formattedTime}</span>;
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      renderCell: (params) => {
        // If date is a dayjs object or can be parsed by dayjs
        const formattedDate = dayjs(params.value).format("YYYY-MM-DD");
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleClickOpen(params.row)}
            style={{ color: "white" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            style={{ color: "white" }}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "95vh" }}>
      <Sidebar OpenSidebar={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        sx={{
          flexGrow: 1,
          padding: "1rem",
          height: "100%",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{ marginBottom: "10px" }}
        >
          Add Appointment
        </Button>

        <DataGrid
          rows={rows}
          columns={columns.map((column) => ({
            ...column,
            headerAlign: "center",
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
              color: "white",
            },
            "& .MuiDataGrid-cell": {
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            },
          }}
        />

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {formData.id ? "Edit Appointment" : "Add Appointment"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Appointment Name"
              type="text"
              fullWidth
              value={formData.name}
              disabled={formData.id ? true : false}
              onChange={handleChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker
                  label="Medication Time"
                  value={formData.time}
                  onChange={(newTime) => {
                    setFormData({ ...formData, time: newTime });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth // Ensures that the TextField for TimePicker takes full width
                      InputProps={{
                        ...params.InputProps,
                        style: { color: "white" },
                      }}
                    />
                  )}
                  sx={{ marginBottom: 2 }} // Match the TextField styles and spacing
                />
              </DemoContainer>
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Appointment Date"
                value={formData.date}
                onChange={(newDate) => {
                  setFormData({ ...formData, date: newDate });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      style: { color: "white" },
                    }}
                  />
                )}
                sx={{ marginBottom: 2 }}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Box>
    </Box>
  );
}

export default AppointmentSchedule;
