import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import { FaBold, FaHeart } from "react-icons/fa"; // Assuming you're using Font Awesome
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import PulseIcon from "@mui/icons-material/Favorite"; // Assuming you're using this for pulse
import OxygenIcon from "@mui/icons-material/Air"; // This is an assumption, replace with the actual icon you wish to use
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // Assuming this is for pulse rate

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function Home_Comp() {
  const [isEmergency, setEmergency] = useState(false);
  const [prescriptions, setPrescriptions] = useState(0);
  const [reminders, setReminders] = useState(0);
  const [doctors, setDoctors] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [oxygenLevel, setOxygenLevel] = useState(0);
  const [graph, setGraph] = useState(0);


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/user-statistics",
          {
            email: sessionStorage.getItem("user_email"),
          }
        );
        console.log(response.data);
        console.log(response.status);
        if (response.status === 200) {
          setPrescriptions(response.data.prescription_count);
          setReminders(response.data.medicine_count);
          setDoctors(response.data.chat_count);
          setGraph(response.data.health_details);
          const currentDate = new Date().toISOString().slice(0, 10);
          const todayData = response.data.health_details.find(
            item => item.date === currentDate
          );
          if (todayData) {
            setTemperature(todayData.temp);
            setPulse(todayData.pulse);
            setOxygenLevel(todayData.spo2);
          }
        }
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
  }, []); //

  const dummyData = [
    {
      date: "2024-04-14",
      spo2: 98,
      temperature: 98.6,
      pulse: 70,
    },
    {
      date: "2024-04-15",
      spo2: 97,
      temperature: 99.0,
      pulse: 75,
    },
    {
      date: "2024-04-16",
      spo2: 99,
      temperature: 97.8,
      pulse: 72,
    },
    // ... more dummy data ...
  ];

  return (
    <main className="main-container">
      {/* <div className="main-title">
        <h3>DASHBOARD</h3>
      </div> */}

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Prescritption Uploaded</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{prescriptions}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Medication Reminders</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>{reminders}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Doctors </h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{doctors}</h1>
        </div>

      </div>

      <div className="charts">
        {/* <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer> */}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={graph}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="spo2"
              stroke="#8884d8"
              strokeWidth={3}
              name="SpO2 Level"
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#82ca9d"
              strokeWidth={3}
              name="Temperature (°F)"
            />
            <Line
              type="monotone"
              dataKey="pulse"
              stroke="#FF8042"
              strokeWidth={3}
              name="Pulse Rate"
            />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer height="100%">
          <Paper
            elevation={3}
            className="health-parameters"
            style={{
              margin: "1rem",
              padding: "1rem",
              backgroundColor: "#fff0f0",
            }}
          >
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  style={{ marginBottom: "0.5rem", font: FaBold }}
                >
                  Your Last Health Parameters
                </Typography>
                <Typography
                  variant="body2"
                  style={{ marginBottom: "0.5rem", fontSize: "1rem" }}
                >
                  <OxygenIcon /> SpO2 Level: {oxygenLevel}%
                </Typography>
                <Typography
                  variant="body2"
                  style={{ marginBottom: "0.5rem", fontSize: "1rem" }}
                >
                  <ThermostatIcon /> Temperature: {temperature}°F
                </Typography>
                <Typography variant="body2" style={{ fontSize: "1rem" }}>
                  <FavoriteBorderIcon /> Pulse Rate: {pulse} bpm
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home_Comp;
