// This part is contributed by Rishitha
// This is the Admin.jsx which is basically the admin dashboard where the admin can see the total employees.
// Also he can view their details, scorecards and timesheet

import React, { useState, useEffect } from "react";
import Adprofile from '../components/admin_profile'
import { RxHamburgerMenu,RxCross2 } from "react-icons/rx";
import EmployeeCard from "../components/EmployeeCard";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {FaUser} from  "react-icons/fa"

const Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [profilevalue, setProfileValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");  // for storing the 
  const [employees, setEmployees] = useState([]); // Store the original list of employees
  const [filteredEmployees, setFilteredEmployees] = useState([]); // for filtering the employees

  useEffect(() => {
    const fetchedUsername = sessionStorage.getItem("userName");
    setUsername(fetchedUsername);
    fetchAllEmployees();
    displayData();
    if (sessionStorage.getItem("auth") === "false") {
      navigate("/");
    }
    else if(sessionStorage.getItem("auth") === "true" &&sessionStorage.getItem("userName")[0]==='E' ) 
    {
      navigate("/Employee")
    }
  }, []);

  // Display the details of the Admin
  const displayData = async () => {
    try {
      const named = sessionStorage.getItem("userName");
      const url = `http://localhost:3000/users/${named}`;
      const response = await axios.get(url);
      const data = response.data;
      setProfileValue(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const url = `http://localhost:3000/users`;
      const response = await axios.get(url);
      const data = response.data.users; // Extract the array of users from the object
   // Filter users where is_admin is false
   const adminUsers = data.filter(user => user.is_admin === false);
   setEmployees(adminUsers);
   setFilteredEmployees(adminUsers);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    toast.success("Log out successfully");
    sessionStorage.setItem("auth", "false");
    sessionStorage.setItem("admin", "false");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("password", "");
    setTimeout(() => {
      navigate("/");
    }, 4000); // Adjust the delay as needed
  };

  const [isProfileVisible, setProfileVisible] = useState(false);
  const toggleProfileVisibility = () => {
    setProfileVisible(!isProfileVisible);
  };
  const updateProfileValue = (updatedProfile) => {
    setProfileValue(updatedProfile);
  };

  const [isProfileDivVisible, setProfileDivVisible] = useState(false);
  const toggleProfileDivVisibility = () => {
    setProfileDivVisible(!isProfileDivVisible);
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim(); // Trim whitespace
    setSearchQuery(query);
    
    const filtered = employees.filter((employee) => {
      // Convert name and email to lowercase for case-insensitive comparison
      const lowercaseQuery = query.toLowerCase();
      const employeeName = employee.name.toLowerCase();
      const employeeid = employee.userid.toLowerCase();
      const employeeEmail = employee.email ? employee.email.toLowerCase() : "";
      
      // Check if the query is present in the lowercase versions of name or email
      const nameMatch = employeeName.includes(lowercaseQuery);
      const emailMatch = employeeEmail.includes(lowercaseQuery);
      const idMatch = employeeid.includes(lowercaseQuery);
  
      // Return true if any of the matches are found
      return nameMatch || idMatch || emailMatch;
    });
    
    // Set filteredEmployees based on the query
    setFilteredEmployees(filtered);
  };
  

  return (
    <div style={{backgroundColor:"#EDF4F2"}} className=" flex min-h-lvh">
      <ToastContainer />
      <div className=" p-4 pt-6 bg-blue-gray-200 w-full relative">
          <div className="flex justify-between">
          <p className="mt-4 text-lg text-slate-700 font-bold"> ADMIN ID : {JSON.parse(sessionStorage.getItem("data")).userid}</p>

          <h1 style={{color:"#66A5AD"}} className="uppercase text-center text-3xl font-extrabold text-gray-900  md:text-5xl lg:text-5xl"> Admin Dashboard </h1>
            <div className="flex gap-5 mt-3">
              <p className="text-lg text-slate-700 font-bold">
                Hii, {JSON.parse(sessionStorage.getItem("data")).name}   
              </p> 
          <p>
                         {JSON.parse(sessionStorage.getItem('data')).image!==null?<img onClick={toggleProfileVisibility} src={JSON.parse(sessionStorage.getItem('data')).image} className="w-10 h-10  object-scale-down  rounded-full border-2"/>:<FaUser onClick={toggleProfileVisibility} className="text-2xl  text-slate-700" />}
            </p>
          </div>

        </div>
        <div className={ isProfileVisible?`bg-transparent fixed right-0 top-20 inset-0 flex z-50 backdrop-filter backdrop-blur-sm`:isProfileDivVisible?`bg-transparent fixed right-0 top-24 inset-0 flex z-50 backdrop-filter backdrop-blur-sm`:"bg-transparent fixed flex"}>
        {isProfileVisible && (
          <div className=" bg-slate-200 border border-slate-400 rounded absolute right-0 top-19 w-32 p-2 h-28" >
           <div className="border-white flex justify-center">
           <div className='absolute top-0 right-0  hover:bg-slate-400 hover:text-white rounded-full p-1'>
            <RxCross2 className='text-xl'onClick={toggleProfileVisibility}/>
          </div>
</div>
            <div className="editprofilediv mt-6 text-lg">
              <p
                className="border-b font-medium hover:text-red-700 border-red-700 py-1 px-2 hover:cursor-pointer"
                onClick={() => {
                  toggleProfileDivVisibility();
                  displayData();
                }}
              >
                Edit Profile
              </p>
              <button onClick={handleLogout} className="px-4 font-medium hover:text-red-700 hover:cursor-pointer">
                Logout
              </button>
            </div>
          </div>
        )}
        
        {isProfileDivVisible && (
          <div className=" bg-transparent absolute left-1/2 -top-10 w-20 z-10">
            <Adprofile 
             profilevalue={profilevalue.user}
             onUpdateProfile={updateProfileValue} // Pass the function to update profile value
             func={toggleProfileDivVisibility}
            />
          </div>
        )}
        </div>
       <div className="mt-4 flex justify-center p-4 ">
  <input
    className="bg-white border outline-none border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-slate-600 focus:border-slate-600 block w-3/4 p-3.5"
    type="search"
    name=""
    id=""
    placeholder="Search Employee by name or employee ID or email..."
    value={searchQuery}
    onChange={handleSearch}
  />
</div>

<div className="flex flex-wrap justify-center py-1 px-5  gap-10">
  {filteredEmployees.map((employee, index) => (
    <EmployeeCard
      key={index}
      employeeData={employee}
    />
  ))}
</div>
      </div>
    </div>
  );
};

export default Admin;
