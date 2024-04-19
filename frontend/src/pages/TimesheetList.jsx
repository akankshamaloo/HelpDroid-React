// This code is contributed by Rithik
import axios from 'axios';
import React,{useState} from 'react';
import { toast,ToastContainer } from 'react-toastify';
import { FaCamera, FaUser } from "react-icons/fa";
import { RxHamburgerMenu,RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar.jsx"

const TimesheetList = () => {

  var count = 0;
  const [viewtime, setviewtime] = useState(false);
  const [date, setdate] = useState([]);

  const handleoldtimesheet = async () => {
    //week range is bought from dropdown menu
    var e = document.getElementById("month");
    var value = e.value;
    //This part is to throw error if the value is empty 
    if (e.value === "") {
      toast.error("Select a Week range");
      return false;
    }
    //This part is to fetch timesheet data from timelog table
    const response = await axios
      .post("http://localhost:3000/gettaskdetails", {
        userid: sessionStorage.getItem("userName"),
        startDate: value.split("-")[0],
        endDate: value.split("-")[1],
      })
      .catch((error) => {
        toast.error(error.message);
      });
    if (response.status === 200) {
      // Response data is Array of object 
      //Response format [{date: '2024-02-22', task: 'asdf', duration: '3.00'},{date: '2024-02-23', task: 'asdf', duration: '5.00'}]
      // The task is fetched from each object of the array and stored in an object in order to find unique task
      const d = {};
      response.data.taskDetails.map((e) => {
        if (e.task in d) {
          d[e.task].push([e.date, e.duration]);
        } else {
          d[e.task] = [[e.date, e.duration]];
        }
      });
      //then object of taks is converted to array of unique task 
      //{"asdf":1,"java":2,"cpp":3,"py":3,"go":1} --> ["asdf","java","cpp","py","go"]
      sessionStorage.setItem("values", JSON.stringify(Object.keys(d)));
      // In this part [{date: '2024-02-22', task: 'asdf', duration: '3.00'},{date: '2024-02-23', task: 'asdf', duration: '5.00'}] 
      // is converted to Object of Array {"asdf":[0,5,6,3,2],"java":[0,5,6,3,2]} 
      // key of depends on number of unique task,Values of object is of same length 5 
      // 5 index has the duration of tasks on each week day
      const f = {};
      const h = Object.keys(d);

      for (var val = 0; val < h.length; val++) {
        f[h[val]] = [];
        for (var j = 0; j < 5; j++) {
          var l = document.getElementById("month").value;
          var value = l.split("-")[0];
          const dt = new Date(value);
          dt.setDate(dt.getDate() + j);
          const newdt = dt.toLocaleDateString("fr-CA");

          let found = false; 

          for (var i = 0; i < d[h[val]].length; i++) {
            if (newdt == d[h[val]][i][0]) {
              f[h[val]].push(d[h[val]][i][1]);
              found = true; 
              break;
            }
          }

          if (!found) {
            f[h[val]].push(0);
          }
        }
      }
      // converted Object of Array {"asdf":[0,5,6,3,2],"java":[0,5,6,3,2]} is stored in udestate
      setdate(f);
      // Delay is added to ensure that data is converted to proper format
      setTimeout(() => {
        setviewtime(true);
      }, 700);
    }
  };
  const n = useNavigate();
  //This function is to handle logout
  const handleLogout = () => {
    toast.success("Log out successfully");
    sessionStorage.setItem("auth", "false");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("password", "");
    setTimeout(() => {
      n("/");
    }, 4000);
  };
  //this is to handle side bar display
  const [ham,setHam]=useState(true)
  const close=()=>{setHam(false)}
  const open=()=>{setHam(true)}
  return (
    <div className='flex'>
      <ToastContainer />
      {/* This div is for side bar */}
      <Sidebar ham={ham} setHam={close}/>
      {/* This div is for Timesheet list component */}
      <div className={ham?"bg-transparent sticky left-64  w-5/6 z-10":'bg-transparent  w-full z-10'}>
        {ham?<></>:<RxHamburgerMenu className="ml-4 mt-4 hover:cursor-pointer text-3xl" onClick={()=>{setHam(true)}}/>}
              <div className="flex flex-col justify-center items-center w-full  p-10 ">
              <h1 className=" text-slate-700 font-bold text-3xl mb-2">
                View Timesheet
              </h1>
              {/* this  div if for week range drop down and submit button */}
              <div className="flex flex-row w-2/4 items-center justify-center my-5 gap-3">
                <select
                  className="bg-slate-300 rounded-md  p-3 w-64 outline:none"
                  name="month"
                  id="month"
                >
                  <option value="">Select week range</option>
                  {JSON.parse(sessionStorage.getItem("date_ranges")).map(
                    (val) => {
                      return (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      );
                    }
                  )}
                  
                </select>

                <button
                  onClick={handleoldtimesheet}
                  className="bg-cyan-600 hover:bg-cyan-500 px-8 py-3 text-white rounded-md"
                >
                  Submit
                </button>
              </div>
              {/* this div is to display old timesheet */}
              {viewtime ? (

                  <div className="flex relative mt-5 overflow-y-auto shadow-md sm:rounded-md">
                    <table className=" bg-white w-full text-sm text-gray-500">
                      <thead className="w-full text-white text-center text-base bg-cyan-600 ">
                        <tr className="relative ">
                          <th
                            scope="col"
                            className="w-50 py-2  border-white border-r-2 uppercase text-xl "
                          >
                            <span className="absolute left-20 top-12">
                              {" "}
                              Task
                            </span>
                          </th>
                          <th
                            colSpan="5"
                            scope="col"
                            className="h-15 px-6 py-4 uppercase text-xl"
                          >
                            Duration
                          </th>

                          <th
                            scope="col"
                            className="w-40 px-6 py-2 border-white border-l-2 uppercase text-xl"
                          >
                            <span className="absolute right-13 top-12">
                              {" "}
                              Total
                            </span>
                          </th>
                          <th scope="col" className="px-6 py-3"></th>
                        </tr>
                        <tr>
                          <th scope="col" className="px-6 py-3 "></th>
                          {/* this map function if for displaying week day's date */}
                          {[...Array(5)].map((_, index) => {
                            var e = document.getElementById("month").value;
                            var value = e.split("-")[0];
                            const dt = new Date(value);
                            dt.setDate(dt.getDate() + index);
                            const newdt = dt.toLocaleDateString("en-US", {
                              dateStyle: "short",
                            });
                            const days = [
                              "Sunday",
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                            ];
                            return (
                              <th
                                key={index}
                                scope="col"
                                className="px-6 py-3 border-2 border-white"
                              >
                                {days[index + 1]} <br /> {newdt}
                              </th>
                            );
                          })}
                          <th scope="col" className="px-6 py-3"></th>
                          <th scope="col" className="px-6 py-3"></th>
                        </tr>
                      </thead>
                        {/* This is for displaying the task done in that week */}
                      <tbody>
                        {JSON.parse(sessionStorage.getItem("values")).map(
                          (val) => {
                            return (
                              <tr key={val} className="bg-white">
                                <th
                                  scope="row"
                                  className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                  <input
                                    type="text"
                                    id={val}
                                    className="mt-4 text-center bg-slate-100 h-12 w-full border border-gray-300"
                                    disabled={true}
                                    value={val}
                                  />
                                </th>
                              {/* this map function is to fetch date based on task and display it in rows */}
                                {date[val].map((value) => {
                                  return (
                                    <td
                                      scope="row"
                                      className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap "
                                    >
                                      <input
                                        type="text"
                                        id={val}
                                        className="mt-4 text-center bg-slate-100 h-12 w-full border border-gray-300"
                                        disabled={true}
                                        value={value}
                                      />
                                    </td>
                                  );
                                })}
                                {/* this one is to calculate the total duration wrt to task */}
                                <td
                                  scope="row"
                                  className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap "
                                >
                                  <input
                                    type="text"
                                    id={val}
                                    className="mt-4 text-center bg-slate-100 h-12 w-full border border-gray-300"
                                    disabled={true}
                                    value={date[val].reduce((c, v) => {
                                      return c + parseFloat(v);
                                    }, 0)}
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                        {/* this on is to calculate total duration wrt each days */}
                        <tr className="">
                          <th
                            scope="row"
                            className="px-6 py-4 font-bold text-xl text-cyan-700 whitespace-nowrap"
                          >
                            Total
                          </th>

                          {[0, 1, 2, 3, 4].map((dayIndex) => {
                            var c = 0;
                            for (
                              var i = 0;
                              i < Object.values(date).length;
                              i++
                            ) {
                              c += parseFloat(Object.values(date)[i][dayIndex]);
                            }
                            count += c;
                            return (
                              <td
                                key={dayIndex}
                                className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap "
                              >
                                <input
                                  type="text"
                                  className="mt-4 text-center bg-slate-100 h-12 w-full border border-gray-300"
                                  disabled={true}
                                  value={parseFloat(c)}
                                />
                              </td>
                            );
                          })}
                          <td className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap ">
                            <input
                              type="text"
                              className="mt-4 text-center bg-slate-100 h-12 w-full border border-gray-300"
                              disabled={true}
                              value={count}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

              ) : (
                <></>
              )}
              
                </div>
            </div>
            </div>
  );
};

export default TimesheetList;
