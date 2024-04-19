import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={toggleSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={toggleSidebar}
      />
      <div className="content">
        <Outlet /> {/* This replaces the {children} */}
      </div>
    </div>
  );
};

export default Layout;
