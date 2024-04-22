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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleFetchData = () => {
        // This is where you would actually call your API to get the data
        // For now, we're just using dummy data
        // setData(newData);
    };

    return (
        <div className="container">
            <Sidebar OpenSidebar={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, p: 2, borderRadius: 2 }}>
                <Box>
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
                                {data.temperature || '90.89'} {/* Assuming '90' is a placeholder for temperature data */}
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
                                {data.pulse || '90.89'} {/* Assuming '90' is a placeholder for temperature data */}
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

                            <Typography variant="h6">TEMPERATURE</Typography>
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
                                {data.temperature || '90.89'} {/* Assuming '90' is a placeholder for temperature data */}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Other cards for EDA and Heart Rate similar to the above */}

                </Box>
                <ResponsiveContainer width="50%">
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
                                    Your Health Status
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{ marginBottom: "0.5rem", fontSize: "1rem" }}
                                >
                                    <MdCreditScore /> Condition: { }
                                </Typography>
                                <Typography
                                    variant="body2"
                                    style={{ marginBottom: "0.5rem", fontSize: "1rem" }}
                                >
                                    < MdOutlineMessage /> Message: { }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                </ResponsiveContainer>
            </Box>
            <Button
                variant="contained"
                color="primary"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                onClick={handleFetchData}
            >
                Refresh Data
            </Button>
        </div>
    )
};

export default CheckHealth;
