// This is the Timesheet module where the user can access the current timesheet

// This code is contributed by Sagar

// Here we are importing the necessary libraries and files
import React, { useState, useEffect } from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


const Timesheet = () => {

  // These are the usestate hooks where we initialise the initial and the updates values
  const [rowCount, setRowCount] = useState(1);
  const [timeData, setTimeData] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [timesheets, setTimesheets] = useState([]);
  const [isAnyFieldFilled, setIsAnyFieldFilled] = useState(false);
  const [userScore, setUserScore] = useState(0); 
  var sum =0;


  const currentDate = new Date();//Define current date
  const currentDay = currentDate.getDay(); // Define current day


  // This useEffect hook ensures that isAnyFieldFilled is updated whenever timeData changes, reflecting whether any field in timeData is filled or not.
  useEffect(() => {
    const filled = timeData.some((row) =>row.some((field, index) => index !== 0 && field !== ""));
    setIsAnyFieldFilled(filled);

  }, [timeData]);

  //  This useEffect hook retrieves saved data from the sessionStorage and updates the component's state with that data if it exists
    useEffect(()=>{
      const savedData = JSON.parse(sessionStorage.getItem("timesheetData"));
      if (savedData) {
        setTimeData(savedData.timeData);
        setRowCount(savedData.rowCount);
      }
      

// function for displaying the task details by api calling

const fetchdata = async () => {
  const response = await axios.post("http://localhost:3000/gettaskdetails", {
    userid: sessionStorage.getItem("userName"),
    startDate: weekDates.monday,
    endDate: weekDates.friday,
  }).catch((error) => {
    toast.error(error.message);
  });
  
  if (response.status === 200) {
    const d = {};
    response.data.taskDetails.forEach((e) => {
      if (e.task in d) {
        d[e.task].push([e.date, e.duration]);
      } else {
        d[e.task] = [[e.date, e.duration]];
      }
    });

    const f = {};
    const h = Object.keys(d);

    for (let val = 0; val < h.length; val++) {
      f[h[val]] = [];
      for (let j = 0; j < 5; j++) {
        const dt = new Date(weekDates.monday);
        dt.setDate(dt.getDate() + j);
        const newdt = dt.toLocaleDateString("fr-CA");

        let found = false;
        let durationValue = ''; // Initialize durationValue as empty string

        for (let i = 0; i < d[h[val]].length; i++) {
          if (newdt === d[h[val]][i][0]) {
            durationValue = d[h[val]][i][1]; // Assign duration value if found
            found = true;
            break;
          }
        }

        f[h[val]].push(durationValue !== '0.00' ? durationValue : '');

      }
    }

    setTimeData(Object.entries(f).map(([task, durations]) => [task, ...durations]));
    setRowCount(Object.keys(f).length===0?1:Object.keys(f).length);  }
}

        fetchdata()
    },[]);


  const fetchWeekRange = async () => {
    try
    {
      const response = await axios.post('http://localhost:3000/daterange',
        {
          "userid": sessionStorage.getItem("userName"),
        }         
      );   
      const data= response.data;
      console.log("week_ranges",data)
      if(response.status!==200)
      {
        console.log(
          `${response.status}\n${response.statusText}\n${data.message}`
       )
      }
      if(response.status===200)
      {
        sessionStorage.setItem("date_ranges",JSON.stringify(data.dateRanges))  
      }   
    }
    catch(error)
    {
      toast.error("Error in fetching week range")
    }
  }  

 // function for getting the week dates
  const getWeekDates = (offset = 0) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff =
      today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + offset * 7;
    const monday = new Date(today.setDate(diff));
    const friday = new Date(monday);
    friday.setDate(friday.getDate() + 4);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const mondayFormatted = monday.toLocaleDateString("en-US", options);
    const fridayFormatted = friday.toLocaleDateString("en-US", options);
    return { monday: mondayFormatted, friday: fridayFormatted };
  };

  useEffect(() => {
    const { monday, friday } = getWeekDates(weekOffset);
    setWeekDates({ monday, friday });
  }, [weekOffset]);

  const [weekDates, setWeekDates] = useState(getWeekDates());

  const updateTimeData = (index, dayIndex, value) => {
    const newData = [...timeData];
    if (!newData[index]) newData[index] = [];
    if (!newData[index][dayIndex]) newData[index][dayIndex] = "";
    if (dayIndex === 0 && !newData[index][dayIndex])
      newData[index][dayIndex] = value;
    // Update task name only if not already present
    else newData[index][dayIndex] = value; // Update day data
    setTimeData(newData);
  };

  

// function to add rows on clicking + sign

  const addRow = () => {
    setRowCount(rowCount + 1);
  };

  // function to remove rows on clicking - sign

  const removeRow = async (index) => {
    if (rowCount > 1) {
      const updatedData = [...timeData];
      updatedData.splice(index, 1);

      const updatedTimesheets = timesheets.map((timesheet) => ({
        ...timesheet,
        tasks: timesheet.tasks.filter((task, taskIndex) => taskIndex !== index),
      }));

      setTimeData(updatedData);
      setTimesheets(updatedTimesheets);
      setRowCount(rowCount - 1);

      var inputDate = new Date(weekDates.monday);
      // Format the Date object to "YYYY-MM-DD" format
      const sdate = `${inputDate.getFullYear()}-${(inputDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${inputDate.getDate().toString().padStart(2, "0")}`;

      inputDate = new Date(weekDates.friday);
      // Format the Date object to "YYYY-MM-DD" format
      const edate = `${inputDate.getFullYear()}-${(inputDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${inputDate.getDate().toString().padStart(2, "0")}`;


      try {
        const response = await axios.post(
          "http://localhost:3000/deletetimelog",
          {
            userid: sessionStorage.getItem("userName"),
            task: timeData[index][0],
            startDate: sdate,
            endDate: edate,
          }
        );

        

        
        if (response.status === 200) {
          toast.success("Deleted successfully");
        }
      } catch (error) {
        // toast.error("Error in deleting");
      }
    }
  };

    // function calculate total

  const calculateTotal = (dayIndex) => {
    let total = 0;
    timeData.forEach((rowData) => {
      if (rowData && rowData[dayIndex + 1]) {
        total += parseFloat(rowData[dayIndex + 1]);
      }
    });
    return total;
  };
    // function calculate task total

    const calculateTaskTotal = (taskIndex) => {
    let total = 0;
    if (timeData[taskIndex]) {
      timeData[taskIndex].slice(1).forEach((value) => {
        if (value) {
          total += parseFloat(value);
        }
      });
    }
    return total;
  };

      // function calculate week number

  const calculateWeekNumber = (mondayDate) => {
    mondayDate = new Date(
      Date.UTC(
        mondayDate.getFullYear(),
        mondayDate.getMonth(),
        mondayDate.getDate()
      )
    );
    mondayDate.setUTCDate(
      mondayDate.getUTCDate() + 4 - (mondayDate.getUTCDay() || 7)
    );
    var yearStart = new Date(Date.UTC(mondayDate.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((mondayDate - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  };
  const handleSubmit = async () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday

    // Check if the current day is Friday (day index 5)
    if (currentDay === 5) {
      const isFridayFieldsFilled = timeData.every((row) => row[6] !== "");
      if (!isFridayFieldsFilled) {
        toast.error(
          "Please fill in the fields for thursday before submitting."
        );
        return;
      }
      const submissionTime =
        currentDate.getHours() * 60 + currentDate.getMinutes(); // Convert current time to minutes

      // Check if submission time is before 8:50 AM (530 minutes)
      const bonusPoints = submissionTime < 18 * 60 + 30 ? 10 : 0;

      const isAnyTaskFilled = timeData.every((row) => {
        const taskName = row[0];
        const durations = row.slice(1);
        return durations.every(
          (duration, index) =>
            duration === "" || (taskName !== "" && duration !== "")
        );
      });


      // function to check if duration is filled without task
      const isAnyDurationFilledWithoutTaskName = timeData.some((row) => {
        const taskName = row[0];
        const durations = row.slice(1);
        return durations.some(
          (duration, index) => duration !== "" && taskName === ""
        );
      });

      if (isAnyTaskFilled && !isAnyDurationFilledWithoutTaskName) {
        const isTimesheetSaved = timesheets.some(
          (timesheet) =>
            timesheet.weekRange === `${weekDates.monday} - ${weekDates.friday}`
        );
        if (isTimesheetSaved) {
          setWeekOffset(weekOffset + 1);
          const emptyData = timeData.map((row) => row.map(() => ""));
          setTimeData(emptyData);
          setRowCount(1);
          toast.success("Timesheet submitted Successfully");
          // Calculate week number based on the Monday of the displayed week range
          const mondayDate = new Date(weekDates.monday);
          const weekNumber = calculateWeekNumber(mondayDate);

          const updatedUserScore = userScore + bonusPoints;
          setUserScore(updatedUserScore);

         
          try {
            const response = await axios.post(
              "http://localhost:3000/scorecard",
              {
                date_range: `${weekDates.monday} - ${weekDates.friday}`,
                userid: sessionStorage.getItem("userName"),
                week_number: weekNumber,
                score: bonusPoints,
              }
            );

            const data = response.data;
            fetchWeekRange();

           
          } catch (error) {
            toast.error("Error in creating database row!");
          }
        } else {
          toast.error("Please save the timesheet before submitting.");
        }
      } else if (!isAnyTaskFilled && isAnyDurationFilledWithoutTaskName) {
        toast.error("Please fill task name for every filled duration.");
      } else {
        toast.error(
          "Please fill in both task name and duration for each task."
        );
      }
    } else {
      // Display a message or prevent submission if it's not Friday
      toast.error("You can only submit timesheets on Friday.");
    }
  };

  const [isFirstEntry, setIsFirstEntry] = useState(true);
  const handleSave = async () => {
    const dataToSave = { timeData, rowCount };
    // Save timesheet data to sessionStorage
    sessionStorage.setItem("timesheetData", JSON.stringify(dataToSave));
    const isAnyTaskFilled = timeData.every((row) => {
      const taskName = row[0];
      const durations = row.slice(1);
      return durations.every(
        (duration, index) =>
          duration === "" || (taskName !== "" && duration !== "")
      );
    });

    const isAnyDurationFilledWithoutTaskName = timeData.some((row) => {
      const taskName = row[0];
      const durations = row.slice(1);
      return durations.some(
        (duration, index) => duration !== "" && taskName === ""
      );
    });

    const isAnyTaskWithFilledDuration = timeData.some((row) => {
      const taskName = row[0];
      const durations = row.slice(1);
      return durations.some((duration) => duration !== "") && taskName !== "";
    });

    if (
      isAnyTaskFilled &&
      !isAnyDurationFilledWithoutTaskName &&
      isAnyTaskWithFilledDuration
    ) {
      // Process the timesheet data for saving
      const existingTimesheetIndex = timesheets.findIndex(
        (timesheet) =>
          timesheet.weekRange === `${weekDates.monday} - ${weekDates.friday}`
      );
      const updatedTaskData = timeData.map((taskData, index) => ({
        task: taskData[0] || "",
        durations: taskData.slice(1).filter((duration) => duration !== ""), // Filter out empty durations
        day: taskData
          .slice(1)
          .map((duration, dayIndex) => {
            if (duration !== "") {
              const currentDate = new Date(weekDates.monday);
              currentDate.setDate(currentDate.getDate() + dayIndex);
              return currentDate.toLocaleDateString("en-GB");
            }
          })
          .filter((date) => date !== undefined),
      }));
      for (const task of updatedTaskData) {
        const { day, durations, task: taskName } = task;
        for (let i = 0; i < day.length; i++) {
          const duration = durations[i];
          var date = day[i];
          var parts = date.split("/");
          var date = `${parts[2]}-${parts[1]}-${parts[0]}`;

          
          //api calling

          try {
            const response = await axios.post("http://localhost:3000/timelog", {
              userid: sessionStorage.getItem("userName"),
              date: date,
              task: taskName,
              duration: duration,
              status: "save",
            });

            const data = response.data;
           

            
          } catch (error) {
            toast.error("Error in creating database row!");
          }
        }
      }
      if (existingTimesheetIndex !== -1) {
        const existingTimesheet = timesheets[existingTimesheetIndex];

        const updatedTimesheets = [...timesheets];
        updatedTimesheets[existingTimesheetIndex] = {
          ...existingTimesheet,
          tasks: updatedTaskData,
        };
        setTimesheets(updatedTimesheets);
        toast.success("Timesheet updated successfully");
      } else {
        const newTimesheet = {
          timesheetNumber:
            timesheets.length > 0
              ? timesheets[timesheets.length - 1].timesheetNumber + 1
              : 1,
          weekRange: `${weekDates.monday} - ${weekDates.friday}`,
          tasks: updatedTaskData,
        };

        setTimesheets([...timesheets, newTimesheet]);
        setIsFirstEntry(false);
        toast.success("Timesheet saved successfully");
        if (isFirstEntry) {
          setIsFirstEntry(false);
        }
      }
    } else if (!isAnyTaskFilled && isAnyDurationFilledWithoutTaskName) {
      toast.error("Please fill task name for every filled duration.");
    } else if (!isAnyTaskWithFilledDuration) {
      toast.error("Please fill at least one duration for each task.");
    } else {
      toast.error("Please fill in both task name and duration for each task.");
    }
  };

 

  return (
    <div className="w-full mt-20">
      {/* toast container for displaying toast messages */}
      <ToastContainer />
{/* displaying current week */}
      <div className="flex justify-start my-10  text-slate-700 font-bold text-2xl">
        <p>
         
          Current Week:
          <span className="font-medium text-xl text-cyan-400">
            {weekDates.monday} - {weekDates.friday}
          </span>
        </p>
       
      </div>
        <p>{}</p>
      <div className="relative  overflow-x-auto shadow-md sm:rounded-md">
        <table className=" bg-white w-full text-sm text-gray-500">
          <thead className="w-full text-white text-center text-base bg-cyan-600 ">


            <tr className="relative ">
                            {/* defining table heading for task name */}

              <th
                scope="col"
                className="w-50 py-2  border-white border-r-2 uppercase text-xl "
              >
                <span className="absolute left-20 top-12"> Task</span>
              </th>

              {/* defining table heading for duration(of hours) */}
              <th
                colSpan="5"
                scope="col"
                className="h-15 px-6 py-4 uppercase text-xl"
              >
                Duration
              </th>
              {/* defining table heading for total hours */}

              <th
                scope="col"
                className="w-40 px-6 py-2 border-white border-l-2 uppercase text-xl"
              >
                <span className="absolute right-13 top-12"> Total</span>
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
            <tr>
              <th scope="col" className="px-6 py-3 "></th>
              {[...Array(5)].map((_, index) => {
                const currentDate = new Date(weekDates.monday);
                currentDate.setDate(currentDate.getDate() + index);
                const year = currentDate.getFullYear();
                const month = (currentDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const day = currentDate.getDate().toString().padStart(2, "0");
                const days = [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ];
                const dayName = days[currentDate.getDay()];
                const formattedDate = `${day}-${month}-${year} `;
                return (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 border-2 border-white"
                  >
                    {dayName} <br /> {formattedDate}
                  </th>
                );
              })}
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {[...Array(rowCount)].map((_, index) => (
              <tr key={index} className="bg-white">
                <th
                  scope="row"
                  className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                 {/* input field for task name */}
                  <input
                    type="text"
                    className="mt-4 text-center bg-slate-100 h-12 w-full border border-gray-300"
                    value={timeData[index]?.[0] || ""}
                    onChange={(e) => updateTimeData(index, 0, e.target.value)}
                  />
                </th>
                {[0, 1, 2, 3, 4].map((dayIndex) => (
                  <td key={dayIndex} className="">
                     {/* input field for task duration */}

                    <input
                      type="number"
                      className="mt-4 ml-8 w-3/4 h-12 text-center bg-slate-100 border border-gray-300"
                      value={timeData[index]?.[dayIndex + 1] || ""}
                      onChange={(e) =>
                        updateTimeData(index, dayIndex + 1, e.target.value)
                      }
                      disabled={dayIndex >= currentDay}
                    />
                  </td>
                ))}
                <td className="text-center text-xl">
                  {calculateTaskTotal(index)}
                </td>

        {/* implementing add and remove row icons */}


                <td className="flex pt-9 ">
                  {index === 0 ? (
                    <FiPlusCircle
                      className="text-2xl cursor-pointer mr-2"
                      onClick={addRow}
                    />
                  ) : (
                    <>
                      <FiPlusCircle
                        className="text-2xl cursor-pointer mr-2"
                        onClick={addRow}
                      />
                      <FiMinusCircle
                        className="text-2xl cursor-pointer"
                        onClick={() => removeRow(index)}
                      />{" "}
                    </>
                  )}
                </td>
              </tr>
            ))}


{/* calculating total from that particular row */}

            <tr className="">
              <th
                scope="row"
                className="px-6 py-4 font-bold text-xl text-cyan-700 whitespace-nowrap"
              >
                Total
              </th>
              {[0, 1, 2, 3, 4].map((dayIndex) => {
                sum+=calculateTotal(dayIndex)
                return (
                <td key={dayIndex} className="text-center text-lg">
                  {calculateTotal(dayIndex)}
                </td>
              )})}
              <td className="text-center text-lg">{sum}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end p-4 gap-4">


{/* save button to save the task related details in the database */}

        <button
          type="button"
          className="bg-cyan-500 hover:bg-cyan-400 px-8 py-3 text-white rounded-sm"
          onClick={handleSave}
        >
          Save
        </button>

{/* submit button to submit the timesheet */}

        <button
          type="submit"
          className={`px-8 py-3 rounded-sm ${
                        // applying design changes according to button being disabled or not 

            currentDay !== 5       
              ? "bg-gray-200 text-slate-700 cursor-not-allowed"
              : "bg-cyan-500 text-white hover:bg-cyan-400"
          }`}
          onClick={handleSubmit}

            // disabling if current day is not friday
          disabled={currentDay !== 5} 
        >
          Submit
        </button>
       
      </div>
     

      
    </div>
  );
};

export default Timesheet;
