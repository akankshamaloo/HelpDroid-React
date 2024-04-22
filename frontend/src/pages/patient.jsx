import { useState } from "react";
import "../index.css";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import Home_Comp from "../components/Home_comp";

function Patient() {
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="grid-container">
      {/* <Header OpenSidebar={OpenSidebar} /> */}
      <Sidebar toggleSidebar={toggleSidebar} OpenSidebar={isSidebarOpen} />
      <Home_Comp />
    </div>
  );
}

export default Patient;
