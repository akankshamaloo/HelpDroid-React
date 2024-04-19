import React, { useState } from "react";
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
import { Box, useTheme } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Sidebar from "../components/Sidebar";

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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    medicationName: "",
    time: new Date(),
  });

  const handleFileChange = (event) => {
    setFormData({ ...formData, time: event.target.value });
  };

  const handleClickOpen = (row) => {
    setFormData(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setFormData({ id: null, medicationName: "", time: new Date() });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleSave = () => {
    if (formData.id) {
      setRows(rows.map((row) => (row.id === formData.id ? formData : row)));
    } else {
      setRows([...rows, { ...formData, id: rows.length + 1 }]);
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
      width: 180,
    },
    {
      field: "time",
      headerName: "Time",
      width: 130,
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 130,
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

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#000" }}>
      <Sidebar OpenSidebar={true} />
      <Box
        sx={{
          flexGrow: 1,
          padding: "1rem",
          backgroundColor: "#121212",
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

        <DataGrid rows={rows} columns={columns} pageSize={5} />

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
              onChange={handleChange}
              InputProps={{
                style: { color: "white" },
              }}
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
                      InputProps={{ style: { color: "white" } }}
                    />
                  )}
                />
              </DemoContainer>
            </LocalizationProvider>
            {/* <TimePicker
                label="Time"
                value={formData.time}
                onChange={(newTime) => {
                  setFormData({ ...formData, time: newTime });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{ style: { color: "white" } }}
                  />
                )}
              /> */}
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
