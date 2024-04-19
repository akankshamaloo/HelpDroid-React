import React, { useState } from "react";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";

function PrescriptionUploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("prescription", selectedFile);

    // Replace 'your-api-endpoint' with your actual API endpoint
    const response = await fetch("your-api-endpoint", {
      method: "POST",
      body: formData,
      // Include other headers if necessary, like authentication tokens
    });

    if (response.ok) {
      // Handle success
      alert("Prescription uploaded successfully!");
      // Clear the selected file if necessary
      setSelectedFile(null);
    } else {
      // Handle error
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <>
      <Sidebar OpenSidebar={true} />
      <Paper elevation={3} sx={{ p: 4, mt: 4, mx: "auto", maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
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
    </>
  );
}

export default PrescriptionUploadPage;
