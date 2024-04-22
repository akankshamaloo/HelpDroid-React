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
import { Box, useTheme, Chip, Stack } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Sidebar from "../components/Sidebar";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer } from "react-toastify";
// Styles for the DataGrid columns
// const useStyles = makeStyles({
//   root: {
//     "& .super-app-theme--header": {
//       color: "#ffffff",
//     },
//     "& .super-app-theme--cell": {
//       color: "#ffffff",
//     },
//   },
// });

function MedicationSchedule() {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Aspirin",
      time: "08:00 AM",
      days: { Sun: 0, Mon: 1, Tue: 1, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
    },
    {
      id: 2,
      name: "Ibuprofen",
      time: "12:00 PM",
      days: { Sun: 0, Mon: 0, Tue: 1, Wed: 0, Thu: 1, Fri: 0, Sat: 0 },
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    time: dayjs(), // Initialize with current time as a dayjs object
    days: { Sun: 0, Mon: 0, Tue: 1, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
  });
  const [selectedDays, setSelectedDays] = useState({
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  });
  const formatTime = (time) => {
    return dayjs(time).format("h:mm A"); // "8:00 AM" or "8:00 PM"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/get-medication",
          {
            email: sessionStorage.getItem("user_email"),
          }
        );
        console.log(response);

        if (response.status === 200) {
          // Add unique IDs to each contact
          const rowsWithIds = response.data.data.map((row) => ({
            ...row,
            id: uuidv4(),
          }));
          setRows(rowsWithIds);
          console.log(rowsWithIds);
        } else {
          toast.error(response.data.message || "Failed to fetch contacts.");
        }
      } catch (err) {
        // Handle error
      }
    };
    fetchData();
  }, []);

  const handleDaySelect = (day) => {
    setSelectedDays({
      ...selectedDays,
      [day]: selectedDays[day] ? 0 : 1, // Toggle the day selection
    });
  };
  const formatDaysForApi = () => {
    return weekdays.reduce((acc, day) => {
      acc[day] = selectedDays[day] || 0; // Default to 0 if not set
      return acc;
    }, {});
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, time: event.target.value });
  };

  const handleClickOpen = (row) => {
    console.log("row", row);
    setFormData({
      ...row,
      time: dayjs(row.time), // Ensure this is converted to dayjs object
      days: row.days,
      id: row.id,
    });
    setSelectedDays(row.days);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDays({ Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 });

    setOpen(false);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      time: dayjs(),
      days: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
    }); // Reset using dayjs
    setOpen(true);
  };

  const handleDelete = async (id) => {
    setRows(rows.filter((row) => row.id !== id));
    try {
      const response = await axios.post(
        "http://localhost:5000/remove-medication",
        {
          email: sessionStorage.getItem("user_email"),
          medication: rows.filter((row) => row.id === id)[0].name,
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        console.log("Medication removed successfully");
        toast.success("Medication removed successfully");
      } else {
        console.log("Failed to remove medication");
        toast.error("Failed to remove medication");
      }
    } catch (err) { }
  };

  const handleSave = async () => {
    const formattedTime = formData.time.format();
    console.log({
      email: sessionStorage.getItem("user_email"),
      medication: formData.name,
      time: formattedTime,
      days: formatDaysForApi(),
    });
    if (formData.id) {
      setRows(
        rows?.map((row) =>
          row.id === formData.id ? { ...formData, days: selectedDays } : row
        )
      );
      try {
        const response = await axios.post(
          "http://localhost:5000/edit-medication",
          {
            email: sessionStorage.getItem("user_email"),
            medication: formData.name,
            time: formattedTime,
            days: selectedDays,
          }
        );
        if (response.status === 200) {
          toast.success("Medication updated successfully");
        } else {
          toast.error(response.data.message || "Failed to update medication");
        }
      } catch (err) { }
    } else {
      setRows([
        ...rows,
        { ...formData, days: selectedDays, id: rows.length + 1 },
      ]);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload-medication",
          {
            email: sessionStorage.getItem("user_email"),
            medication: formData.name,
            time: formattedTime,
            days: selectedDays,
          }
        );
        if (response.status === 200) {
          toast.success("Medication added successfully");
        } else {
          toast.error(response.data.message || "Failed to add medication");
        }
      } catch (err) { }
    }

    handleClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const renderDayCells = (params) => {
    const daysValues = params.value || {};
    return (
      <Stack direction="row" spacing={1}>
        {weekdays.map((day) => {
          const isSelected = parseInt(daysValues[day]) === 1;

          return (
            <Chip
              key={day}
              label={day}
              sx={{
                bgcolor: isSelected ? "white" : "transparent",
                color: isSelected ? "black" : "white",
                border: "1px solid white",
                "&:hover": {
                  bgcolor: isSelected ? "lightblue" : "white",
                  color: "black",
                },
              }}
            />
          );
        })}
      </Stack>
    );
  };
  const columns = [
    {
      field: "name",
      headerName: "Medication Name",
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
      field: "days",
      headerName: "Days",
      width: 550,
      renderCell: renderDayCells,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
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
  function getWeekdayAbbreviation(time) {
    // Assuming `time` is a string with the format 'DayName HH:MM AM/PM', e.g., 'Monday 08:00 AM'
    // Extract the day name and get the first three characters
    const dayName = dayjs(time, "dddd HH:mm A").format("ddd"); // Format to get day abbreviation
    return dayName;
  }
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
          Add Medication
        </Button>

        <DataGrid
          rows={rows?.map((row) => ({
            ...row,
            weekday: getWeekdayAbbreviation(row.time), // Add the weekday field to each row
          }))}
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
            {formData.id ? "Edit Medication" : "Add Medication"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Medication Name"
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
            <Stack direction="row" spacing={1} sx={{ marginY: 2 }}>
              {Object.keys(selectedDays).map((day) => (
                <Chip
                  label={day}
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  color={selectedDays[day] ? "primary" : "default"}
                  variant={selectedDays[day] ? "filled" : "outlined"}
                  sx={{
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "0.75rem",
                    "& .MuiChip-label": {
                      padding: 0,
                    },
                  }}
                />
              ))}
            </Stack>
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

export default MedicationSchedule;
