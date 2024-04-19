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
} from "react-icons/bs";

import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const [clickedSection, setClickedSection] = useState("");
  const handleClickSection = (section) => {
    setClickedSection(section);
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
          <BsCart3 className="icon_header" /> SHOP
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a href="/patient">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </a>
        </li>
        <li className="sidebar-list-item">
          <div onClick={() => handleClickSection("prescription")}>
            <BsFillArchiveFill className="icon" /> {role ? "" : "Prescription"}
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
          <div onClick={() => handleClickSection("contacts")}>
            <BsPeopleFill className="icon" /> Emergency Contacts
          </div>

          {clickedSection === "contacts" && (
            <>
              <ListItem button component="a" href="/addcontacts">
                <ListItemIcon>
                  <CloudUploadIcon />
                </ListItemIcon>
                <ListItemText primary="Add Emergency Contacts" />
              </ListItem>
              <ListItem button component="a" href="/managecontacts">
                <ListItemIcon>
                  <ManageSearchIcon />
                </ListItemIcon>
                <ListItemText primary="Manage Emergency Contacts" />
              </ListItem>
            </>
          )}
        </li>
        <li className="sidebar-list-item">
          <a href="/chatwithdoctor">
            <BsListCheck className="icon" /> Chat with Doctor
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="/checkhealth">
            <LocalHospitalIcon className="icon" /> Check Your Health
          </a>
        </li>
        <li className="sidebar-list-item">
          <a href="">
            <BsFillGearFill className="icon" /> Setting
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
