import React, { useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    Box,
} from '@mui/material';
import Sidebar from '../components/Sidebar';
import axios from "axios";
import { FaBold } from "react-icons/fa"; // Assuming you're using Font Awesome
import { ResponsiveContainer } from "recharts";
import { ToastContainer, toast } from "react-toastify";
import { Card, CardContent, SvgIcon } from '@mui/material';
import iconTemp from '../assets/temp.jpg';
import temp from '../assets/tp.png';
import iconPulse from '../assets/pulse.jpg';
import iconOxygen from '../assets/oxygen.jpg';
import pulse from '../assets/pr.png';
import oxygen from '../assets/oxy.png';
import Paper from "@mui/material/Paper";
import { MdOutlineMessage, MdCreditScore } from "react-icons/md";

const CheckHealth = () => {
    const [data, setData] = useState({
        temperature: '',
        pulse: '',
        oxygen: ''
    });
    const [msg, setMsg] = useState("");
    const [score, setScore] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleFetchData = async () => {
        // This is where you would actually call your API to get the data
        // For now, we're just using dummy data
        // setData(newData);
        try {
            const currentDate = new Date().toISOString().slice(0, 10);
            const response = await axios.post("http://localhost:5000/check-score", {
                email: sessionStorage.getItem("user_email"),
                date: currentDate,
            });
            console.log(response)
            if (response.status === 200) {
                toast.success("Score successful!");
                const responseData = response.data;
                setData({
                    temperature: responseData.temperature || '', // Assuming temperature is in responseData
                    pulse: responseData.pulse || '', // Assuming pulse is in responseData
                    oxygen: responseData.spo2 || '', // Assuming oxygen is in responseData
                });
                setMsg(responseData.msg || '');
                setScore(responseData.condition || '');

            } else {
                toast.error(response.data.message || "scroe failed.");
            }
        } catch (error) {
            toast.error(
                "score failed: " +
                (error.response?.data?.message || "Unknown Error")
            );
            console.error("score error:", error);
        }
    };

    return (
        <div className="container">
            <Sidebar OpenSidebar={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <Grid container spacing={2} sx={{ p: 2 }}>
                {/* Left Grid with Cards */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ width: '500px', height: '180px', background: '#091d52', color: '#fff', position: 'relative' }}>
                        <CardContent>
                            <div style={{
                                position: 'absolute',
                                left: '70%',
                                top: '10%',  // Adjust this value to leave space from the top
                                bottom: '10%',  // Adjust this value to leave space from the bottom
                                width: '2px',
                                background: '#ccc'
                            }}></div>

                            <Typography variant="h6">TEMPERATURE</Typography>
                            <img
                                src={iconTemp}
                                alt="Icon"
                                style={{
                                    width: 80, // Increased size to 80px
                                    height: 80, // Increased size to 80px
                                    borderRadius: '50%',
                                    border: '1.5px solid #fff',
                                    position: 'absolute',
                                    left: '15%', // Center horizontally
                                    top: '60%', // Center vertically
                                    transform: 'translate(-50%, -50%)', // Move it to the center
                                }}
                            />
                            <img
                                src={temp}
                                alt="Icon"
                                style={{
                                    width: 200, // Increased size to 80px
                                    height: 80, // Increased size to 80px

                                    position: 'absolute',
                                    left: '46%', // Center horizontally
                                    top: '60%', // Center vertically
                                    transform: 'translate(-50%, -50%)', // Move it to the center
                                }}
                            />
                            <Typography
                                variant="h4"
                                style={{
                                    color: '#fff', // Set text color to white
                                    fontSize: '3rem', // Increase font size, adjust as needed
                                    position: 'absolute',
                                    left: '85%', // Adjust this to position the text field
                                    top: '50%', // Adjust this to align vertically as needed
                                    transform: 'translate(-50%, -50%)', // Center the text properly
                                }}
                            >
                                {data.temperature} {/* Assuming '90' is a placeholder for temperature data */}
                            </Typography>
                        </CardContent>
                    </Card>
                    <br />

                    <Card sx={{ width: '500px', height: '180px', background: '#091d52', color: '#fff', position: 'relative' }}>
                        <CardContent>
                            <div style={{
                                position: 'absolute',
                                left: '70%',
                                top: '10%',  // Adjust this value to leave space from the top
                                bottom: '10%',  // Adjust this value to leave space from the bottom
                                width: '2px',
                                background: '#ccc'
                            }}></div>

                            <Typography variant="h6">PULSE RATE</Typography>
                            <img
                                src={iconPulse}
                                alt="Icon"
                                style={{
                                    width: 80, // Increased size to 80px
                                    height: 80, // Increased size to 80px
                                    borderRadius: '50%',
                                    border: '1.5px solid #fff',
                                    position: 'absolute',
                                    left: '15%', // Center horizontally
                                    top: '60%', // Center vertically
                                    transform: 'translate(-50%, -50%)', // Move it to the center
                                }}
                            />
                            <img
                                src={pulse}
                                alt="Icon"
                                style={{
                                    width: 200, // Increased size to 80px
                                    height: 80, // Increased size to 80px

                                    position: 'absolute',
                                    left: '46%', // Center horizontally
                                    top: '60%', // Center vertically
                                    transform: 'translate(-50%, -50%)', // Move it to the center
                                }}
                            />
                            <Typography
                                variant="h4"
                                style={{
                                    color: '#fff', // Set text color to white
                                    fontSize: '3rem', // Increase font size, adjust as needed
                                    position: 'absolute',
                                    left: '85%', // Adjust this to position the text field
                                    top: '50%', // Adjust this to align vertically as needed
                                    transform: 'translate(-50%, -50%)', // Center the text properly
                                }}
                            >
                                {data.pulse} {/* Assuming '90' is a placeholder for temperature data */}
                            </Typography>

                        </CardContent>
                    </Card>

                    <br />
                    <Card sx={{ width: '500px', height: '180px', background: '#091d52', color: '#fff', position: 'relative' }}>
                        <CardContent>
                            <div style={{
                                position: 'absolute',
                                left: '70%',
                                top: '10%',  // Adjust this value to leave space from the top
                                bottom: '10%',  // Adjust this value to leave space from the bottom
                                width: '2px',
                                background: '#ccc'
                            }}></div>

                            <Typography variant="h6">SPO2</Typography>
                            <img
                                src={iconOxygen}
                                alt="Icon"
                                style={{
                                    width: 80, // Increased size to 80px
                                    height: 80, // Increased size to 80px
                                    borderRadius: '50%',
                                    border: '1.5px solid #fff',
                                    position: 'absolute',
                                    left: '15%', // Center horizontally
                                    top: '60%', // Center vertically
                                    transform: 'translate(-50%, -50%)', // Move it to the center
                                }}
                            />
                            <img
                                src={oxygen}
                                alt="Icon"
                                style={{
                                    width: 200, // Increased size to 80px
                                    height: 80, // Increased size to 80px

                                    position: 'absolute',
                                    left: '46%', // Center horizontally
                                    top: '60%', // Center vertically
                                    transform: 'translate(-50%, -50%)', // Move it to the center
                                }}
                            />
                            <Typography
                                variant="h4"
                                style={{
                                    color: '#fff', // Set text color to white
                                    fontSize: '3rem', // Increase font size, adjust as needed
                                    position: 'absolute',
                                    left: '85%', // Adjust this to position the text field
                                    top: '50%', // Adjust this to align vertically as needed
                                    transform: 'translate(-50%, -50%)', // Center the text properly
                                }}
                            >
                                {data.temperature} {/* Assuming '90' is a placeholder for temperature data */}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Grid for the Health Status Paper */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: '1rem', backgroundColor: "#fff0f0" }}>
                        <Card>
                            <CardContent >
                                <Typography
                                    variant="h6"
                                    component="div"
                                    style={{ marginBottom: "0.5rem", font: FaBold }}
                                >
                                    Your Health Status
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{ marginBottom: "0.5rem", fontSize: "1rem" }}
                                >
                                    <MdCreditScore /> Condition: {score}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{ marginBottom: "0.5rem", fontSize: "1rem" }}
                                >
                                    < MdOutlineMessage /> Message: {msg}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                </Grid>


            </Grid>

            <Button
                variant="contained"
                color="primary"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                onClick={handleFetchData}
            >
                Check Health Parameters
            </Button>
        </div>
    )
};

export default CheckHealth;
