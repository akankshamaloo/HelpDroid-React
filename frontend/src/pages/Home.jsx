import { useState } from "react";
import "../index.css";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import Home_Comp from "../components/Home_comp";

function Home() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

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

export default Home;
