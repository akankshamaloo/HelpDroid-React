import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgotpassword from "./pages/forgotpassword";
import Profile from "./pages/Profile";
import Scorecard from "./pages/Scorecard";
import TimesheetList from "./pages/TimesheetList";
import Home from "./pages/Home";
import User_profile from "./pages/user_profile";
import Patient from "./pages/patient";
import PrescriptionUploadPage from "./pages/uploadPrescription";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="admin" element={<Admin />} />
          <Route path="register" element={<Register />} />
          <Route path="forgotpassword" element={<Forgotpassword />} />
          <Route path="profile" element={<Profile />} />
          <Route path="home" element={<Home />} />
          <Route path="scorecard" element={<Scorecard />} />
          <Route path="timesheetlist" element={<TimesheetList />} />
          <Route path="patient" element={<Patient />} />
          <Route
            path="uploadprescription"
            element={<PrescriptionUploadPage />}
          />
          <Route path="userprofile" element={<User_profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
