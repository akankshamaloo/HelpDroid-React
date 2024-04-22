import { useState } from "react";
import "../index.css";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import Home_Doc from "../components/home_doc";

function Doctor() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      {/* <Header OpenSidebar={openSidebarToggle} toggleSidebar={OpenSidebar} /> */}
      <Sidebar toggleSidebar={OpenSidebar} OpenSidebar={openSidebarToggle} />
      <Home_Doc />
    </div>
  );
}

export default Doctor;
