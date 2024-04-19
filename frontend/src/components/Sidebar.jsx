import React,{useState} from 'react';
import { FaUser } from "react-icons/fa";
import { RxHamburgerMenu,RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const Sidebar = ({ham,setHam}) => {
    const n = useNavigate();
    const handleLogout = () => {
        toast.success("Log out successfully");
        sessionStorage.setItem("auth", "false");
        sessionStorage.setItem("userName", "");
        sessionStorage.setItem("password", "");
        setTimeout(() => {
          n("/");
        }, 4000);
      };
  return (
    <div className={ham?`w-1/6 fixed flex flex-col p-3 bg-cyan-600 bg-opacity-35   h-lvh`:`hidden`}>
      {ham?<RxCross2 className="absolute hover:cursor-pointer top-2 left-48 text-3xl" onClick={setHam}/>:<></>}
        <div className=" justify-center relative mt-10 mb-4 rounded-full flex">
        {JSON.parse(sessionStorage.getItem('data')).image!==null?<img src={JSON.parse(sessionStorage.getItem('data')).image} className="w-32 h-30 object-scale-down mt-2 rounded-full"/>:<FaUser className="ml-5 mt-5 w-14 h-14" />}
          
        </div>
        <p className="text-center font-bold text-lg">Hii {JSON.parse(sessionStorage.getItem('data')).name}</p>
        <p className="text-center font-bold text-lg">Employee ID : {JSON.parse(sessionStorage.getItem('data')).userid}</p>

        <div className="mt-16 text-xl  flex flex-col gap-8  text-center w-full justify-center items-start">
        {document.URL.split('/')[3]=='employee'?
          <div className='w-full'>
          <Link to='/employee'><p className='text-white text-left bg-cyan-600 px-3 py-3 w-full rounded-md font-bold'>Current Timesheet</p></Link>
          </div>:
          <Link  to= '/employee'  className="px-3 hover:font-semibold">Current Timesheet</Link>
          }
        {document.URL.split('/')[3]=='timesheetList'?
          <div className='w-full'>
          <Link to='/timesheetList'><p className='text-white text-left bg-cyan-600 px-3 py-3 w-full rounded-md font-bold'>Timesheet List</p></Link>
          </div>:
          <Link to='/timesheetList' className="px-3 hover:font-semibold ">Timesheet List</Link>
          }
        {document.URL.split('/')[3]=='scorecard'?
          <div className='w-full'>
          <Link to='/scorecard'><p className='text-white text-left bg-cyan-600 px-3 py-3 w-full rounded-md font-bold'>Score Card</p></Link>
          </div>:
          <Link to='/scorecard'  className="px-3 hover:font-semibold ">Score Card</Link>
          }
        {document.URL.split('/')[3]=='profile'?
          <div className='w-full'>
          <Link to='/profile'><p className='text-white text-left bg-cyan-600 px-3 py-3 w-full rounded-md font-bold'>Edit Profile</p></Link>
          </div>:
          <Link to='/profile'  className="px-3 hover:font-semibold">Edit Profile</Link>
          }
          
          
          <button
            className="px-6 py-2   absolute bottom-2 rounded-md border font-medium bg-red-600 hover:bg-red-700 text-white   hover:cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
  )
}

export default Sidebar