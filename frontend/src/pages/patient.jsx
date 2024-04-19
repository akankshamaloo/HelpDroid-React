import { useState } from "react";
import "../index.css";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import Home_Comp from "../components/Home_comp";

function Patient() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />
      <Home_Comp />
    </div>
  );
}

export default Patient;
