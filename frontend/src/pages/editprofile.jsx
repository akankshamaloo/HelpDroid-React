import React, { useState } from "react";
import {
    TextField,
    Autocomplete,
    Button,
    Box,
    Typography,
    Chip,
    InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const specializations = [
    { label: "Cardiology" },
    { label: "Dermatology" },
    { label: "Neurology" },
    { label: "Pediatrics" },
    { label: "Orthopedics" },
    { label: "Gynecology" },
    { label: "Ophthalmology" },
    { label: "ENT" },
    { label: "Psychiatry" },
    { label: "General Physician" },
    { label: "Dentistry" },
    { label: "Physiotherapy" },
    { label: "Homeopathy" },
    { label: "Ayurveda" },
    { label: "Unani" },
    { label: "Naturopathy" },
    { label: "Siddha" },
    { label: "Acupuncture" },
    { label: "Nutritionist" },
    { label: "Veterinary" },
    { label: "Others" },
];

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const EditProfile = () => {
    const [addresses, setAddresses] = useState([
        {
            clinicAddress: "",
            startTime: dayjs().format("HH:mm"),
            endTime: dayjs().format("HH:mm"),
            days: [],
        },
    ]);
    const [fees, setFees] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const currentTime = new Date().toISOString().substring(0, 16);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedSpecializationLabel, setSelectedSpecializationLabel] = useState("");

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleAddAddress = () => {
        setAddresses([
            ...addresses,
            {
                clinicAddress: "",
                startTime: dayjs().format("HH:mm"),
                endTime: dayjs().format("HH:mm"),
                days: [],
            },
        ]);
    };

    const handleSpecializationChange = (event, newValue) => {
        setSelectedSpecializationLabel(newValue.label); // Update the selected specialization label when the user selects a specialization
    };

    const handleChange = (index, field) => (event) => {
        const newAddresses = [...addresses];
        newAddresses[index][field] = event.target.value;
        setAddresses(newAddresses);
    };

    const handleDayChange = (index, day) => {
        const newAddresses = [...addresses];
        const currentIndex = newAddresses[index].days.indexOf(day);
        if (currentIndex === -1) {
            newAddresses[index].days.push(day);
        } else {
            newAddresses[index].days.splice(currentIndex, 1);
        }
        setAddresses(newAddresses);
    };

    const handleSave = async () => {
        const selectedSpecialization = specializations.find(spec => spec.label === selectedSpecializationLabel);
        console.log({ addresses, fees, yearsOfExperience, selectedSpecialization, selectedSpecializationLabel });
        try {
            const response = await axios.post("http://localhost:5000/doctor-details", {
                'email': sessionStorage.getItem("user_email"),
                'specializations': selectedSpecialization.label,
                'fees': fees,
                'yearsOfExperience': yearsOfExperience,
                'addresses': addresses,
            });
            console.log(response);
            if (response.status === 200) {
                toast.success("Profile updated successfully!");
            }
            else {
                toast.error("Failed to update profile");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container">
            <Sidebar OpenSidebar={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", px: 2, py: 4 }}>
                <Autocomplete
                    options={specializations}
                    getOptionLabel={(option) => option.label}

                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Specialization"
                            margin="normal"
                            fullWidth
                            InputLabelProps={{ style: { color: "white" } }}
                            sx={{
                                "& label.Mui-focused": { color: "white" },
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": { borderColor: "white" },
                                    "&:hover fieldset": { borderColor: "white" },
                                    "&.Mui-focused fieldset": { borderColor: "white" },
                                    "& input": { color: "white" },
                                },
                            }}
                        />
                    )}
                    sx={{
                        width: "100%",
                        "& .MuiAutocomplete-inputRoot": {
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                            },
                        },
                    }}
                    onChange={handleSpecializationChange}
                />
                <TextField
                    fullWidth
                    label="Fees"
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true, style: { color: "white" } }}
                    sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Years of Experience"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true, style: { color: "white" } }}
                    sx={{
                        input: { color: "white" },
                        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                        },
                    }}
                />
                {addresses.map((address, index) => (
                    <Box key={index} sx={{ border: "1px solid grey", p: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ color: "white" }}>
                            Clinic Address {index + 1}
                        </Typography>

                        <TextField
                            fullWidth
                            label={`Clinic Address ${index + 1}`}
                            value={address.clinicAddress}
                            onChange={handleChange(index, "clinicAddress")}
                            margin="normal"
                            InputLabelProps={{ shrink: true, style: { color: "white" } }}
                            sx={{
                                input: { color: "white" },
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "white",
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            type="time"
                            label="Start Time"
                            defaultValue={currentTime}
                            value={address.startTime}
                            onChange={handleChange(index, "startTime")}
                            margin="normal"
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{
                                style: { color: "white" },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "white",
                                },
                                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                                    { borderColor: "white" },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    { borderColor: "white" },
                            }}
                        />
                        <TextField
                            fullWidth
                            type="time"
                            label="End Time"
                            defaultValue={currentTime}
                            value={address.endTime}
                            onChange={handleChange(index, "endTime")}
                            margin="normal"
                            InputLabelProps={{ style: { color: "white" } }}
                            InputProps={{
                                style: { color: "white" },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "white",
                                },
                                "& .MuiInputBase-input": { color: "white" },
                                "& .MuiSvgIcon-root": { color: "white" },
                            }}
                        />

                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.3 }}>
                            {daysOfWeek.map((day) => (
                                <Chip
                                    key={day}
                                    label={day}
                                    clickable
                                    color="primary"
                                    onClick={() => handleDayChange(index, day)}
                                    variant={address.days.includes(day) ? "filled" : "outlined"}
                                    sx={{ color: "white", borderColor: "white" }} // Inline style for chip text and border color
                                />
                            ))}
                        </Box>
                    </Box>
                ))}
                <Button
                    variant="outlined"
                    startIcon={<AddIcon sx={{ color: "white" }} />}
                    onClick={handleAddAddress}
                    sx={{ color: "white", borderColor: "white", mt: 2 }} // Add mt (margin-top) to create space
                >
                    Add Another Address
                </Button>
                <br />
                <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ color: "white" }} />}
                    onClick={handleSave} // Call handleSave function on button click
                    sx={{ color: "white", borderColor: "white", mt: 2 }} // Add mt (margin-top) to create space
                >
                    Save
                </Button>
            </Box>
            <ToastContainer />
        </div>
    );
};

export default EditProfile;