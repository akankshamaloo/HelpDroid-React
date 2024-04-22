import React, { useState } from "react";
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsFillHeartPulseFill,
  BsFillPersonFill,
  BsBoxArrowRight,
} from "react-icons/bs";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [role, setRole] = useState(sessionStorage.getItem("role") + "");
  const [clickedSection, setClickedSection] = useState("");
  const n = useNavigate();

  const handleClickSection = (section) => {
    setClickedSection(section);
  };
  const handleEmergency = async () => {
    console.log("Emergency");
    try {
      const response = await axios.post(
        "http://localhost:5000/emergency",
        {
          email: sessionStorage.getItem("user_email"),
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        console.log("success");
        toast.success("EMERGENCY!! your loved ones have been notified");
      } else {
        toast.error("Error in notifying your loved ones. Please try again.");
      }
    } catch (err) { }
  }
  const handleLogout = () => {
    // Clear sessionStorage
    sessionStorage.clear();
    // Redirect to login page
    n("/");
  };

  //true doctor
  //false patient
  return (

    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <LocalHospitalIcon className="icon_header" /> HelpDroid
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">

        {role == "false" ? (
          <>
            <li className="sidebar-list-item">
              <a href="/patient">
                <BsGrid1X2Fill className="icon" /> Dashboard
              </a>
            </li>
            <li className="sidebar-list-item">
              <div onClick={() => handleClickSection("prescription")}>
                <BsFillArchiveFill className="icon" /> Prescription
              </div>
              {clickedSection === "prescription" && (
                <>
                  <ListItem button component="a" href="/uploadprescription">
                    <ListItemIcon>
                      <CloudUploadIcon />
                    </ListItemIcon>
                    <ListItemText primary="Upload Prescription" />
                  </ListItem>
                  <ListItem button component="a" href="/managepresciption">
                    <ListItemIcon>
                      <ManageSearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Manage Prescription" />
                  </ListItem>
                </>
              )}
            </li>
            <li className="sidebar-list-item">
              <a href="/managemedication">
                <BsFillGrid3X3GapFill className="icon" /> Medication Reminder
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/contact">
                <BsPeopleFill className="icon" /> Emergency Contacts
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/doctorlist">
                <BsListCheck className="icon" /> Chat with Doctor
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/checkhealth">
                <LocalHospitalIcon className="icon" /> Check Your Health
              </a>
            </li>
            <li className="sidebar-list-item">
              <button className="logout-button" onClick={handleLogout}>
                <div className="icon-text-container">
                  <BsBoxArrowRight className="icon" />
                  <span>Logout</span>
                </div>
              </button>
            </li>
            <li className="sidebar-list-item center-aligned">
              {/* Emergency button */}
              <button className="emergency-button" onClick={handleEmergency}>
                <BsFillHeartPulseFill className="icon heart-icon" />
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="sidebar-list-item">
              <a href="/doctor">
                <BsGrid1X2Fill className="icon" /> Dashboard
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/manageappoint">
                <BsFillGrid3X3GapFill className="icon" /> Appointment Reminder
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/doctorlist">
                <BsListCheck className="icon" /> Chat with Patient
              </a>
            </li>
            <li className="sidebar-list-item">
              <a href="/editprofile">
                <BsFillPersonFill className="icon" /> Edit Profile
              </a>
            </li>
            <li className="sidebar-list-item">
              <button className="logout-button" onClick={handleLogout}>
                <div className="icon-text-container">
                  <BsBoxArrowRight className="icon" />
                  <span>Logout</span>
                </div>
              </button>
            </li>
          </>
        )}

      </ul>
    </aside>
  );
}

export default Sidebar;
