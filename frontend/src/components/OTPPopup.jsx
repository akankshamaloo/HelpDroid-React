import React, { useState } from "react";
import { Modal, Paper, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPPopup = ({ isOpen, onClose, onSubmit, onResend }) => {
  const [otp, setOTP] = useState("");

  const handleOTPChange = (e) => {
    setOTP(e.target.value);
  };

  const handleSubmit = () => {
    if (otp.length !== 4 || !/^\d+$/.test(otp)) {
      toast.error(
        otp.length === 0
          ? "Invalid OTP: Field cannot be empty."
          : "Please enter a valid 4-digit OTP."
      );
      return;
    }
    onSubmit(otp);
    setOTP("");
  };

  const handleResend = () => {
    onResend();
    toast.info("OTP has been resent to your email.");
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="otp-modal-title"
      aria-describedby="otp-modal-description"
    >
      <Paper
        elevation={12} // Increased elevation for a more pronounced shadow
        style={{
          margin: "auto",
          padding: "30px",
          width: "500px", // Increased width
          height: "auto", // Adjust height based on content
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          id="otp-modal-title"
          variant="h6"
          component="h2"
          style={{ marginBottom: "20px" }}
        >
          Enter the OTP sent to your email
        </Typography>
        <TextField
          id="otp"
          label="Enter OTP"
          variant="outlined"
          value={otp}
          onChange={handleOTPChange}
          placeholder="4-digit OTP"
          fullWidth
          margin="normal"
        />
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Verify
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResend}>
            Resend
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default OTPPopup;
