import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgotpassword from './pages/forgotpassword';
import Profile from './pages/Profile';
import Timesheet from './components/Timesheet';
import Scorecard from './pages/Scorecard';
import TimesheetList from './pages/TimesheetList';
import Employee from './pages/Employee';
import User_profile from './pages/user_profile';




function App() {
  return (
    <Router>
       
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/timesheet" element={<Timesheet/>} />
          <Route path="/scorecard" element={<Scorecard/>} />
          <Route path="/forgotpassword" element={<Forgotpassword/>} />
          <Route path="/timesheetlist" element={<TimesheetList/>} />
          <Route path="/employee" element={<Employee/>} />
          <Route path="/userprofile" element={<User_profile/>} />

        </Routes>
    </Router>
  );
}

export default App;


