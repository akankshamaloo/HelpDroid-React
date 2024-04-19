import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import For from "./pages/forgotpassword";
import Profile from "./pages/Profile";
import Scorecard from "./pages/Scorecard";
import TimesheetList from "./pages/TimesheetList";
import Home from "./pages/Home";
import User_profile from "./pages/user_profile";
import Patient from "./pages/patient";
import PrescriptionUploadPage from "./pages/uploadPrescription";
import MedicationSchedule from "./pages/Medication";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/scorecard" element={<Scorecard />} />
        {/* <Route path="/forgotpassword" element={<Forgotpassword />} /> */}
        <Route path="/timesheetlist" element={<TimesheetList />} />
        <Route path="/patient" element={<Patient />} />
        <Route
          path="/uploadprescription"
          element={<PrescriptionUploadPage />}
        />
        <Route path="/managemedication" element={<MedicationSchedule />} />

        <Route path="/userprofile" element={<User_profile />} />
      </Routes>
    </Router>
  );
}

export default App;
