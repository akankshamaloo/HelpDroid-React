import { useState } from "react";
import "../index.css";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import Home_Comp from "../components/Home_comp";

function Home() {
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={toggleSidebar} />
      <Sidebar toggleSidebar={toggleSidebar} OpenSidebar={isSidebarOpen} />

      <Home_Comp />
    </div>
  );
}

export default Home;
