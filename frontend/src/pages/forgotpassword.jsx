// This code is contributed by Sabareeshwaran
import React, { useEffect, useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Tb2Fa,TbPasswordMobilePhone  } from "react-icons/tb";
import { useNavigate, useSearchParams } from "react-router-dom";

const Forgotpassword = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [twofa, settwofa] = useState(false);
  const [temp, settemp] = useState("");
  const n = useNavigate();
  useEffect(() => {
    async function fd() {
      if (searchParams.size === 0) {
        toast.error("Unauthorized Access");
        setTimeout(() => {
          n("/");
        }, 4500);
      } else {
        const key = searchParams.get("key");
        const mail = searchParams.get("mail");
        const expiry = searchParams.get("expiry");
        let date1 = new Date(expiry.split("GMT")[0]);
        let date2 = new Date();
        console.log(date1, date2);
        let diff = date2 - date1;
        let seconds = Math.floor(diff / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);

        // Calculate remaining minutes and seconds
        minutes %= 60;
        seconds %= 60;
        console.log(minutes, hours);
        if (hours > 0 || minutes > 10) {
          console.log("invalid");
          toast.error("Link Expired");
          setTimeout(() => {
            n("/");
          }, 4500);
        } else {
          try {
            const response = await axios.post(
              "http://localhost:3000/mail/verifyforgot",
              {
                email: mail,
                key: key,
              }
            );
            console.log(response);
            settemp(response.data.temp);
            if (response.data.auth === false) {
              toast.error("Invalid Link");
              setTimeout(() => {
                n("/");
              }, 4500);
            }
          } catch (error) {
            toast.error(`Invalid Link`);
            setTimeout(() => {
              n("/");
            }, 4500);
          }
        }
      }
    }
    fd();
  }, []);

  const handlereset = async () => {
    const pass=document.getElementById("password").value
    const repass=document.getElementById("repassword").value
    const passregex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if(pass.length===0 ||repass.length===0){
      toast.warning("Empty Field")
      return false
    }
    else if(!passregex.test(pass)){
      toast.warning("Enter a vaild Password")
      toast.info("Password must have \n\nAt least one lowercase letter \n\nAt least one uppercase letter\n\nAt least one digit\n\n At least one special character from the set @$!%*?&\n\nMinimum length of 8 characters.", {  escape: false });
      return false
    }
    else{
      if(pass!==repass){
        return toast.error("Pasword mismatch")
        return false
      }
      else{
        const response = await axios.post("http://localhost:3000/mail/reset", {
      email: searchParams.get("mail"),
      password: document.getElementById("password").value,
    });
    if (response.data.update === false) {
      toast.error(response.error);
    }
    if (response.data.update === true) {
      toast.success("Password Reset Successfully");
      setTimeout(() => {
        n("/");
      }, 4500);
    }
      }

    }
    
    
  };

  const handle2fa = async () => {
    const code = document.getElementById("text").value;

    const response = await axios
      .post("http://localhost:3000/auth/set2fa", {
        email: searchParams.get("mail"),
        temp: temp,
        code: code,
      })
      .catch((e) => toast.error(e.response.data.message));
    console.log(response);
    if (response.status === 200 && response.data.success === true) {
      toast.success("Verfication Successful");
      settwofa(response.data.success);
    }
  };

  return (
    <>
      <section className="back">
        <ToastContainer />
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full border-2 rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className=" p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-center text-slate-700 md:text-2xl ">
                Reset Password
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="text-slate-700 block mb-2 text-sm font-medium  "
                  >
                    Email ID <span className="text-red-600"></span>
                  </label>
                  <div className="flex bg-slate-50 border p-3 rounded">
                    <FaUser className="mr-3" />

                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={searchParams.get("mail")}
                      className="bg-transparent border-none border-b-gray-300 text-gray-900 sm:text-sm -md outline-none block w-full "
                      placeholder="Your email id"
                      required=""
                    />
                  </div>
                </div>
                {twofa ? (
                  <>
                    <div>
                      <label
                        htmlFor="password"
                        className="text-slate-700 block mb-2 text-sm font-medium  "
                      >
                        Password
                      </label>
                      <div className="flex bg-slate-50 border p-3 rounded">
                        <FaLock className="mr-3" />

                        <input
                          type="password"
                          name="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-transparent border-none border-b-gray-300 text-gray-900 sm:text-sm -md outline-none block w-full "
                          required=""
                        />
                      </div>
                    </div>
                    <div>
                      <div>
                        <label
                          htmlFor="repassword"
                          className="text-slate-700 block mb-2 text-sm font-medium  "
                        >
                          Confirm Password
                        </label>
                      </div>
                      <div>
                        <div className="flex bg-slate-50 border p-3 rounded">
                          <FaLock className="mr-3" />

                          <input
                            type="password"
                            name="repassword"
                            id="repassword"
                            placeholder="••••••••"
                            className="bg-transparent border-none border-b-gray-300 text-gray-900 sm:text-sm -md outline-none block w-full "
                            required=""
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={handlereset}
                      className="w-full  text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Reset Password
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 md:space-y-6">
                      <label
                        htmlFor="text"
                        className="text-slate-700 block mb-2 text-sm font-medium  "
                      >
                        Enter Auth ID (6-Digit code)
                        <span className="text-red-600"></span>
                      </label>
                      <div className="flex bg-slate-50 border-2 p-3 rounded">
                        <TbPasswordMobilePhone size={30} className="mr-3" />

                        <input
                          type="text"
                          name="text"
                          id="text"
                          className="bg-transparent border-none  text-gray-900 sm:text-sm -md outline-none block w-full"
                          placeholder="xxxxxx"
                          required=""
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={handle2fa}
                      className="w-full  text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Verify 2FA Code
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Forgotpassword;
