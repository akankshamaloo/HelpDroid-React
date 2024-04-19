import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaPhoneAlt, FaLock } from "react-icons/fa";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import OTPPopup from "../components/OTPPopup.jsx";

const Register = () => {
  const n = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOTPPopupOpen, setIsOTPPopupOpen] = useState(false);

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleOtpPopup = () => {
    setIsOTPPopupOpen(!isOTPPopupOpen);
  };

  // Function to handle registration
  const handleregister = async () => {
    // Fetch values from input fields
    const name = document.getElementById("name").value;
    const pass1 = document.getElementById("password").value;
    const pass2 = document.getElementById("confirm-password").value;
    const email = document.getElementById("email").value;
    const ph = document.getElementById("phone").value;
    const role = document.getElementById("isAdmin").checked;

    // Validation checks
    if (name === "") {
      toast.error("Name cannot be empty");
      return false;
    }
    if (pass1 === "") {
      toast.error("Password cannot be empty");
      return false;
    }
    if (pass2 === "") {
      toast.error("Confirm Password cannot be empty");
      return false;
    }
    if (email === "") {
      toast.error("Email cannot be empty");
      return false;
    }
    if (ph === "") {
      toast.error("Phone cannot be empty");
      return false;
    }
    if (pass1 !== pass2) {
      toast.error("Passwords do not match");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a vaild Email");
      return false;
    }
    if (ph.length < 10 && ph.length > 10) {
      toast.error("Enter a vaild Phone Number");
      return false;
    }
    const passregex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passregex.test(pass1)) {
      toast.error("Enter a vaild Password");
      toast.info(
        "Password must have \n\nAt least one lowercase letter \n\nAt least one uppercase letter\n\nAt least one digit\n\n At least one special character from the set @$!%*?&\n\nMinimum length of 8 characters."
      );
      return false;
    }
    setIsOTPPopupOpen(true);
    //send-otp call
  };
  const completeRegistration = async () => {
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const role = document.getElementById("isAdmin").checked;

    try {
      const response = await axios.post("http://localhost:5000/register", {
        name,
        email,
        mobile: phone,
        password,
        role,
      });
      if (response.status === 200) {
        toast.success("Registration successful!");
        setTimeout(() => {
          n("/");
        }, 2000); // Navigate after success
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      toast.error(
        "Registration failed: " +
          (error.response?.data?.message || "Unknown Error")
      );
      console.error("Registration error:", error);
    }
  };
  // Function to handle OTP submission
  const handleOTPSubmit = async (otp) => {
    try {
      const response = await axios.post("http://localhost:5000/submit-otp", {
        otp,
      });
      if (response.data.success) {
        completeRegistration(); // Proceed with registration if OTP is verified
        setIsOTPPopupOpen(false);
      } else {
        toast.error("OTP verification failed, please try again.");
        // setIsOTPPopupOpen(true); // Reopen the popup for a retry
      }
    } catch (error) {
      toast.error("Failed to submit OTP.");
      console.error("Error submitting OTP:", error);
    }
  };

  // JSX structure for the Register component
  return (
    <section className="logindiv" style={{ backgroundColor: "#EDF4F2" }}>
      <ToastContainer />
      {/* OTP Popup */}
      <OTPPopup
        isOpen={isOTPPopupOpen}
        onClose={() => setIsOTPPopupOpen(false)}
        onSubmit={handleOTPSubmit}
      />
      <div className=" flex flex-col items-center justify-center px-6 py-3 mx-auto md:h-screen lg:py-0 ">
        <div className="w-full border-2 rounded-md shadow min-w-[730px]  md:mt-0 sm:max-w-md xl:p-0">
          <div
            className="px-2 space-y-4 md:space-y-4 sm:p-8"
            style={{ backgroundColor: "#1995AD" }}
          >
            <h1 className="text-xl -mt-5 font-bold leading-tight tracking-tight text-center text-white md:text-2xl ">
              Create an account
            </h1>
            <div className="space-y-4 md:space-y-2" action="#">
              <div className="flex w-full gap-8">
                <div className="flex flex-col gap-5 w-full">
                  <div className="">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-bold text-white "
                    >
                      Name
                    </label>
                    <div className="flex bg-slate-50 border p-3 rounded">
                      <FaUser className="mr-3" />
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="bg-transparent border-none border-b-gray-300 text-slate-600 sm:text-sm -md outline-none block w-full  "
                        placeholder="Your Name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-bold text-white "
                    >
                      Password
                      <span className="text-white font-medium">
                        {" "}
                        (Min. 8 characters and Alphanumeric)
                      </span>
                    </label>
                    <div className="flex bg-slate-50 border p-3 rounded">
                      <FaLock className="mr-3" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-transparent border-none border-b-gray-300 text-slate-600 sm:text-sm -md outline-none block w-full "
                        required
                      />
                      {/* Eye icon to toggle password visibility */}
                      {showPassword ? (
                        <MdVisibilityOff
                          onClick={togglePasswordVisibility}
                          className="cursor-pointer mt-1"
                        />
                      ) : (
                        <MdVisibility
                          onClick={togglePasswordVisibility}
                          className="cursor-pointer mt-1"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block mb-2 text-sm font-bold text-white "
                    >
                      Confirm password
                    </label>
                    <div className="flex bg-slate-50 border p-3 rounded">
                      <FaLock className="mr-3" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm-password"
                        id="confirm-password"
                        placeholder="••••••••"
                        className="bg-transparent border-none border-b-gray-300 text-slate-600 sm:text-sm -md outline-none block w-full "
                        required
                      />
                      {/* Eye icon to toggle confirm password visibility */}
                      {showConfirmPassword ? (
                        <MdVisibilityOff
                          onClick={toggleConfirmPasswordVisibility}
                          className="cursor-pointer mt-1"
                        />
                      ) : (
                        <MdVisibility
                          onClick={toggleConfirmPasswordVisibility}
                          className="cursor-pointer mt-1"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-5 w-full">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-bold text-white "
                    >
                      Email
                    </label>
                    <div className="flex bg-slate-50 border p-3 rounded">
                      <MdEmail className="mr-3" />
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="bg-transparent border-none border-b-gray-300 text-black sm:text-sm -md outline-none block w-full "
                        placeholder="Your Email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-bold text-white "
                    >
                      Phone
                    </label>
                    <div className="flex bg-slate-50 border p-3 rounded">
                      <FaPhoneAlt className="mr-3" />
                      <input
                        type="number"
                        name="phone"
                        id="phone"
                        className="bg-transparent border-none border-b-gray-300 text-slate-600 sm:text-sm -md outline-none block w-full "
                        placeholder="Your Phone"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin checkbox and Login link */}
              <div className="flex  justify-between">
                <div>
                  <input type="checkbox" name="isAdmin" id="isAdmin" />
                  <span className="text-md font-bold text-white pl-2 pb-1">
                    Register as Doctor
                  </span>
                </div>
                <p className="text-md font-bold text-white pb-1">
                  Already have an account?
                  <Link
                    to="/"
                    className="font-bold ml-1 text-cyan-100 hover:underline "
                  >
                    Login here
                  </Link>
                </p>
              </div>

              {/* Register button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  onClick={handleregister}
                  // className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-md text-sm px-5 py-3 text-center"
                  className="w-1/3  text-white bg-cyan-500 hover:bg-cyan-400 font-medium rounded-md text-sm px-5 py-2.5 text-center me-2 "
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
