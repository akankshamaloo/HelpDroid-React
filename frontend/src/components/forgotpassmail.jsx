// This code is contributed by Sabareeshwaran
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { MdEmail } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import loaderGif from "../assets/loading.gif"; // Adjust the path as per your project structure
import ReactLoading from 'react-loading'

const Forgotpassmail = ({ func, mail }) => {
  const [loading, setLoading] = useState(false);

  const mailsend = async () => {
    const email = document.getElementById(mail).value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length === 0) {
      toast.warning("Empty Field");
      return false;
    } else if (!emailRegex.test(email)) {
      toast.warning("Enter a valid Email");
      return false;
    } else {
      setLoading(true); // Set loading state to true
      try {
        const response = await axios.post('http://localhost:3000/mail/forgotpassword', { "email": email });
        toast.success("Reset Mail Sent Successfully \n Check your inbox");
        setTimeout(() => {
          func();
        }, 4500);
      } catch (error) {
        toast.error(error.response.data.message || "Error sending mail");
      } finally {
        setLoading(false); // Set loading state to false regardless of success or failure
      }
    }
  };

  return (
    <div className="relative">
      <ToastContainer />
      <div className="">
        <div className="mt-5 rounded-md shadow min-h-[200px] min-w-[380px] relative ">
         {loading && (
  <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
    {/* <img src={loaderGif} alt="Loading..." /> */}
    <ReactLoading type={"spinningBubbles"} color={"#6d28d9"} height={100} width={100} />
  </div>
)}

          <h1 className="text-xl font-bold  text-center text-black md:text-2xl pt-5 ">
            Forgot Password
          </h1>
          <div className="absolute -top-11 -right-6 mr-2 hover:bg-slate-400 hover:text-white rounded-full p-1">
            <RxCross2 className="text-2xl" onClick={func} />
          </div>
          <div className="p-10">
            <label
              htmlFor={mail}
              className="text-black block mb-2 text-sm font-medium  "
            >
              Email ID <span className="text-red-600"></span>
            </label>
            <div className="flex bg-slate-200 border p-3 rounded">
              <MdEmail className="mr-3 text-xl" />
              <input
                type="email"
                pattern=".+@example\.com"
                name={mail}
                id={mail}
                className="bg-transparent border-none border-b-gray-500 text-gray-900 sm:text-sm -md outline-none block w-full "
                placeholder="Your email id"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={mailsend}
                className="w-full mt-10 text-white bg-cyan-500 hover:bg-cyan-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                {loading ? "Sending..." : "Send Mail"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassmail;
