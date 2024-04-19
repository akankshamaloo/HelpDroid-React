import React, { useState } from "react";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import axios from "axios";

function PrescriptionUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileRead = async () => {
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }

    const reader = new FileReader();

    // This event handler will be called once the read operation is complete
    reader.onload = function (event) {
      const fileContent = event.target.result;
      // Here, `fileContent` contains the binary content of the file
      console.log("File content:", fileContent);
      // You can handle the file content here, e.g., send it to a server or process it
    };

    reader.onerror = function () {
      toast.error("Error reading file!");
    };

    // Read the file as a data URL (base64 encoded string of the file data)
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", sessionStorage.getItem("user_email"));
    try {
      console.log("formData", formData);
      const response = await axios.post("http://localhost:5000/upload-prescription",
        formData,
      );

      console.log(response.status);
      if (response.status === 200) {
        toast.success("Prescription uploaded successfully!");
        setSelectedFile(null); // Clear the file input after successful upload
      } else {
        const errorMsg = await response.text();
        toast.error("Upload failed: " + errorMsg);
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#000000" }}>
      <Sidebar OpenSidebar={true} />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 4,
          flexGrow: 1,
          maxWidth: "80%",
          mx: "auto",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Upload Your Prescription
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="prescription"
            type="file"
            onChange={handleFileChange}
            inputProps={{ accept: "image/*,.pdf" }}
          />
          {selectedFile && (
            <Box sx={{ my: 2 }}>
              <Typography>Selected file: {selectedFile.name}</Typography>
              {selectedFile && selectedFile.type.startsWith("image") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  style={{
                    maxHeight: "200px",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Upload Prescription
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default PrescriptionUploadPage;
