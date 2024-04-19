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
    { id: 1, medicationName: "Aspirin", time: "08:00 AM" },
    { id: 2, medicationName: "Ibuprofen", time: "12:00 PM" },
  ]);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    medicationName: "",
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

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await axios.post("http://localhost:5000/get-medication", {
          'email': sessionStorage.getItem('user_email')
        });
        console.log(response.data);
        if (response.data.success)
          setRows(response.data);
      };
      fetchData();
    } catch (err) { }
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
    setFormData({
      ...row,
      time: dayjs(row.time), // Ensure this is converted to dayjs object
      days: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
    });

    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDays({ Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 });

    setOpen(false);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      medicationName: "",
      time: dayjs(),
      days: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
    }); // Reset using dayjs
    setOpen(true);
  };

  const handleDelete = async (id) => {
    setRows(rows.filter((row) => row.id !== id));
    try {
      const response = await axios.post("http://localhost:5000/remove-medication", {
        'email': sessionStorage.getItem('user_email'),
        'medication': rows.filter((row) => row.id === id)[0].medicationName
      });
      console.log(response.data);
      if (response.data.success) {
        console.log("Medication removed successfully");
        toast.success("Medication removed successfully");
      } else {
        console.log("Failed to remove medication");
        toast.error("Failed to remove medication");
      }
    }
    catch (err) { }
  };

  const handleSave = async () => {
    if (formData.id) {
      setRows(rows?.map((row) => (row.id === formData.id ? formData : row)));
      try {
        const response = await axios.post("http://localhost:5000/edit-medication", {
          'email': sessionStorage.getItem('user_email'),
          'medication': formData.medicationName,
          'time': formData.time,
          'days': formatDaysForApi()
        });
      } catch (err) { }
    }
    else {
      setRows([...rows, { ...formData, id: rows.length + 1 }]);
      try {
        const response = await axios.post("http://localhost:5000/upload-medication", {
          'email': sessionStorage.getItem('user_email'),
          'medication': formData.medicationName,
          'time': formData.time,
          'days': formatDaysForApi()
        });
      } catch (err) { }
    }
    handleClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const columns = [
    {
      field: "medicationName",
      headerName: "Medication Name",
      width: 200,
    },
    {
      field: "time",
      headerName: "Time",
      width: 150,
    },
    {
      field: "days",
      headerName: "Days",
      width: 550,
      renderCell: (params) => {
        const daysValues = params.value || {};
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 0.5,
              width: "100%",
            }}
          >
            {weekdays.map((day) => {
              const isSelected = daysValues[day] === 1;
              return (
                <Chip
                  key={day}
                  label={day}
                  size="small"
                  sx={{
                    width: 48, // Increase width to fit full weekdays
                    height: 48, // Increase height to make it circular
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "blue" : "transparent",
                    border: "1px solid #fff",
                    color: isSelected ? "#fff" : "#fff",
                    fontWeight: isSelected ? "bold" : "normal",
                    ".MuiChip-label": {
                      // Ensure the text is centered
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  }}
                />
              );
            })}
          </Box>
        );
      },
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
      <Sidebar OpenSidebar={true} />
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
              name="medicationName"
              label="Medication Name"
              type="text"
              fullWidth
              value={formData.medicationName}
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
      </Box>
    </Box>
  );
}

export default MedicationSchedule;
