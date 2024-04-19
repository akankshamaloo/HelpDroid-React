import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const ForgotPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSendOtp = () => {
    // TODO: Implement sending OTP logic
    console.log("OTP sent to:", email);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    // TODO: Implement verify OTP logic
    console.log("OTP verified:", otp);
    setStep(3);
  };

  const handleResendOtp = () => {
    // TODO: Implement resend OTP logic
    console.log("OTP resent to:", email);
    toast.info("OTP resent");
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // TODO: Implement reset password logic
    console.log("Password reset for:", email);
    onClose(); // Close the modal
    toast.success("Password has been reset");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">Forgot Password</Typography>
        {step === 1 && (
          <>
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <Button variant="contained" fullWidth onClick={handleSendOtp}>
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <TextField
              margin="normal"
              fullWidth
              label="OTP"
              value={otp}
              onChange={handleOtpChange}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button variant="outlined" onClick={handleResendOtp}>
                Resend OTP
              </Button>
              <Button variant="contained" onClick={handleVerifyOtp}>
                Verify
              </Button>
              <Button variant="outlined" color="error" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              margin="normal"
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <TextField
              margin="normal"
              fullWidth
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
              <Button variant="outlined" color="error" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};
