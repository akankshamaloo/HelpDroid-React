import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Patient from "./pages/patient";
import PrescriptionUploadPage from "./pages/uploadPrescription";
import MedicationSchedule from "./pages/Medication";
import DisplayImages from "./pages/viewprescription";
import ContactSchedule from "./pages/contact";
import DoctorList from "./pages/doctorlist";
import Doctor from "./pages/doctor";
import AppointmentSchedule from "./pages/appointments";
import EditProfile from "./pages/editprofile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/patient" element={<Patient />} />
        <Route
          path="/uploadprescription"
          element={<PrescriptionUploadPage />}
        />
        <Route path="/contact" element={<ContactSchedule />} />
        <Route path="/managemedication" element={<MedicationSchedule />} />
        <Route path="/managepresciption" element={<DisplayImages />} />
        <Route path="/doctorlist" element={<DoctorList />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/manageappoint" element={<AppointmentSchedule />} />
        <Route path="/editprofile" element={< EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
