// This is the employee module which is basically the employee dashboard where he can access different modules

// This code is contributed by Sagar

// Here we are importing the necessary libraries and files

import React, { useState,useEffect, useCallback } from "react";
import {  FaUser } from "react-icons/fa";
import { RxHamburgerMenu,RxCross2 } from "react-icons/rx";
import Timesheet from "../components/Timesheet";
import CountUp from "react-countup";
import ScrollTrigger from "react-scroll-trigger";
import { toast,ToastContainer } from "react-toastify";
import Twofa from "../components/Authentication";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx"


// Component to display an employee dashboard

const Employee = () => {


    // These are the usestate hooks where we initialise the initial and the updates values
  const [counterOn, setCounterOn] = useState(false);
  const [counterResetKey, setCounterResetKey] = useState(0);
  const [username, setUsername] = useState("");
  const [profilevalue, setProfileValue] = useState("");
  const [score,setScore]=useState(0)
  const [week,setWeek]=useState(0)
  const [duration,setDuration]=useState(0)
  const [time_count,setTimeCount]=useState(0)
  const n = useNavigate(); // usenavigate hook to navigate to another page


// function to handle scroll for stats div
  const handleScroll = useCallback(
    (isVisible) => {
      if (!counterOn && isVisible) {
        setCounterOn(true);
        setCounterResetKey((prevKey) => prevKey + 1);
      }
    },
    [counterOn]
  );

// function to handle logout
  const handleLogout = () => {
    toast.success("Log out successfully");
    sessionStorage.setItem("auth", "false");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("password", "");
    setTimeout(() => {
      n("/");
    }, 4000); // Adding the delay 
  };
 
// useeffect hook to navigate to respective dashboard
  useEffect(() => {
    const fetchedUsername = sessionStorage.getItem("userName");
    setUsername(fetchedUsername);
    displayData();
    if (
      sessionStorage.getItem("auth") === "true" &&
      sessionStorage.getItem("userName")[0] === "A"
    ) {
      n("/admin");
      alert('admin')
    } else if (
      sessionStorage.getItem("auth") === "true" &&
      sessionStorage.getItem("userName") !== ""
    ) {
      n("/employee");
    } else {
      n("/");
      alert('logout')
    }

// function to extract total user score through api calling


    const userscore=async ()=>  {
      const response=await axios.post('http://localhost:3000/userscore',{
        "id":fetchedUsername
      })
      setScore(response.data.score)
      setWeek(response.data.week)
      setDuration(response.data.totaldur)
      setTimeCount(response.data.timeseet_count)
      
    }
    userscore();
  }, []);
 

// function to extract user name through api calling

  const displayData = async () => {
    try {
      const named = sessionStorage.getItem("userName");
      const url = `http://localhost:3000/users/${named}`;
      const response = await axios.get(url, {});

      const data = response.data;
      setProfileValue(data);
     
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [ham,setHam]=useState(true)
  const close=()=>{setHam(false)}
  const open=()=>{setHam(true)}
   return (
    <div className="w-full h-screen flex">

       {/* enabling the toast container to display the toast messages */}

      <ToastContainer />

 {/* enabling the two factor authentication module */}

      <Twofa
        className="w-full bg-white"
        visible={sessionStorage.getItem("2fa")}
      />
     <Sidebar ham={ham} setHam={close}/>
      <div className={ham?"w-5/6 sticky left-64 pt-5 ":'w-full'}>
        {ham?<></>:<RxHamburgerMenu className="ml-4 mt-4 text-3xl hover:cursor-pointer" onClick={()=>{setHam(true)}}/>}

{/* stats div to display the number of timesheets */}

        <div className=" flex counterdiv justify-evenly">
          <div className="bg-white border-cyan-600 hover:bg-cyan-500 hover:cursor-pointer hover:text-white hover:border-transparent border-2 text-black font-['Plus Jakarta Sans']  rounded-lg w-56 justify-center items-center flex flex-col text-xl font-bold h-32 gap-5">
            <ScrollTrigger
              key={counterResetKey}
              onEnter={handleScroll}
              onExit={handleScroll}
            >
              {counterOn && (
                <CountUp start={0} end={time_count} duration={2} delay={0} />
              )}
            </ScrollTrigger>
            <p>No. of Timesheets</p>
          </div>

        {/* stats div to display the total number of hours worked  */}


          <div className="bg-white border-cyan-600 hover:bg-cyan-500 hover:text-white hover:border-transparent border-2 text-black font-['Plus Jakarta Sans']  rounded-lg w-56 justify-center items-center flex flex-col text-xl font-bold h-32 gap-5">
            <ScrollTrigger
              key={counterResetKey}
              onEnter={handleScroll}
              onExit={handleScroll}
            >
              {counterOn && (
                <CountUp start={0} end={duration} duration={2} delay={0} />
              )}
            </ScrollTrigger>
            <p>Total Hours Worked</p>
          </div>

        {/* stats div to display the number of hours in the current week  */}


          <div className="bg-white border-cyan-600 hover:bg-cyan-500 hover:text-white hover:border-transparent border-2 text-black font-['Plus Jakarta Sans']  rounded-lg w-56 justify-center items-center flex flex-col text-xl font-bold h-32 gap-5">
            <ScrollTrigger
              key={counterResetKey}
              onEnter={handleScroll}
              onExit={handleScroll}
            >
              {counterOn && (
                <CountUp start={0} end={week} duration={2} delay={0} />
              )}
            </ScrollTrigger>
            <p>Current week Hours</p>
          </div>

                  {/* stats div to display the total score of the employees  */}

          <div className="bg-white border-cyan-600 hover:bg-cyan-500 hover:text-white hover:border-transparent border-2 text-black font-['Plus Jakarta Sans']  rounded-lg w-56 justify-center items-center flex flex-col text-xl font-bold h-32 gap-5">
            <ScrollTrigger
              key={counterResetKey}
              onEnter={handleScroll}
              onExit={handleScroll}
            >
              {counterOn && (
                <CountUp
                  start={0}
                  end={sessionStorage.getItem("score")}
                  duration={2}
                  delay={0}
                />
              )}
            </ScrollTrigger>
            <p>Total Score</p>
          </div>
        </div>


{/* Displaying the current timesheet */}

        <div className="-mt-10 px-5 contentdiv">
          <Timesheet />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default Employee;
