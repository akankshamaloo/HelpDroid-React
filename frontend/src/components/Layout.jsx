import React, { useState } from "react";
import Header from "./header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
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
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
