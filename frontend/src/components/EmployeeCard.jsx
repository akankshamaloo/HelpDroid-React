// This is employee card where the admin can view all the employees 
// This code is contributed by Sagar

// Here we have imported the necessary libraries and files
import React, { useState } from "react";
import img from "../assets/altimg.jpg"
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios  from "axios";
import { toast } from "react-toastify";

// Component to display an employee card
const EmployeeCard = ({ employeeData }) => {

// Function to fetch week range data from the server using an API call
  useEffect(()=>{

    // Defining the function to fetch the week range
    const fetchWeekRange = async () => {
     
      try{
        const response = await axios.post('http://localhost:3000/daterange',
          {
            "userid": employeeData.userid,
          }     
      
        );
     
        const data= response.data;
  
       
      
        if(response.status===200){
          sessionStorage.setItem(`${employeeData.userid}ranges`,JSON.stringify(data.dateRanges)) 
       }
     
      }
        catch(error){
          toast.error("Error in fetching week range")
        }
    }
    fetchWeekRange(); // Call the function to fetch week range data on component mount
  }, []); 
  

  return (
    <div className=" w-1/4">
       {/* Redirecting to user profile page */}
    <Link to='/userprofile' state={{ employee: employeeData }}> 

    <div className="mt-6 border border-slate-300 transition-all rounded-md bg-white hover:cursor-pointer">
      <div className="flex flex-col gap-3">
        <div style={{backgroundColor:"#66A5AD"}} className="w-full bg-gradient-to-r from-teal-100 to-teal-300 pb-4" >

       {/* Displaying the employee's image otherwise displaying an alternative image */}

       {
        employeeData.image?<img src={employeeData.image} alt=""  className="w-36 mt-3 mx-auto h-36 rounded-full"/>:<img src={img} alt=""  className="w-36 mt-3 mx-auto h-36 rounded-full"/>
       }
        

        </div>

{/* Div to display employee's details */}

        <div className="flex gap-3 p-2 px-4">
        <div>
          <p className="leading-7 font-bold">Name:</p>
          <p className="leading-7 font-bold">User Id:</p>
          <p className="leading-7 font-bold">Email:</p>
        </div>
        <div>
          <p className="leading-7 font-medium">{employeeData.name}</p>
          <p className="leading-7 font-medium">{employeeData.userid}</p>
          <p className="leading-7 font-medium">{employeeData.email}</p>
         
        </div>
      </div>
      <button style={{backgroundColor:"#66A5AD"}} className="rounded-sm bg-pink-500 px-3 py-2 mx-4 mb-4 text-white">Details</button>
      </div>
     
    </div>
    </Link>
    </div>
  );
};

export default EmployeeCard;
