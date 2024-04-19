// This part is contributed by Rishitha
// This is the page is used for employee dashboard where the employee can edit current timesheet, view the previous timesheets and scorecard 
// and can edit their profile

import React,{useEffect,useState} from 'react';
import axios from "axios";
import { RxHamburgerMenu,RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { FaCamera, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/Sidebar.jsx"


const Profile = ({profilevalue,onUpdateProfile,func}) => {
    const [image, setImage] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isEditable, setIsEditable] = useState(false); // State to track if fields are editable
    const [editedProfile, setEditedProfile] = useState({ ...profilevalue });
    const [d,setd]=useState(JSON.parse(sessionStorage.getItem("data")))
    const n=useNavigate();
    useEffect(
      ()=>{
        setd(JSON.parse(sessionStorage.getItem("data")))
        if(sessionStorage.getItem('auth')==="false"){
          n('/')
        }
      },[]
    )
    const [ham,setHam]=useState(true)
    const handleLogout = () => {
      toast.success("Log out successfully");
      sessionStorage.setItem("auth", "false");
      sessionStorage.setItem("userName", "");
      sessionStorage.setItem("password", "");
      setTimeout(() => {
        n("/");
      }, 4000); // Adjust the delay as needed
    };
  
    useEffect(() => {
      setEditedProfile({ ...profilevalue }); // Update edited profile when profilevalue changes
    }, [profilevalue]);
  
    const handleCrossClick = () => {
      func()
      setIsVisible(false);
    };
  
    const handleEditClick = () => {
      setIsEditable(true);
    };
  
    const handleSaveClick = () => {
      setIsEditable(false);
      handleInputChange({ target: { name: '', value: '' } });
      updateDatabase();
    };
    
    const updateDatabase = async() => {
 
      try{
        if(image==null)
        {
          setImage(JSON.parse(sessionStorage.getItem("data")).image)
        }
        var val=JSON.parse(sessionStorage.getItem('data'))
        val['image']=image
        sessionStorage.setItem('data',JSON.stringify(val))
        const named = sessionStorage.getItem("userName");
        const url = `http://localhost:3000/users/${named}`;           // The edited data of employee is getting stored in the database
        const response = await axios.put(url,
          {
             "name": d.name,
             "gender": d.gender,
             "email": d.email,
             "phone_number": d.phone_number,
             "age": d.age,
             "address": d.address,
             "image":image
          }     
        );
        if(response.status!==200){
        }
        if(response.status===200){        
         toast.success('Updated Successfully');
        }
        }catch(error){
          toast.error(error.message)
        }
    } 

    // Whenever there is change in details of employee the values are updated 
    const handleInputChange = (e) => {
      if (e && e.target) {
        const { name, value } = e.target;
        setd({
          ...d,
          [name]: value,
        })
        sessionStorage.setItem("data",JSON.stringify({
          ...d,
          [name]: value,
        }))
        JSON.parse(sessionStorage.getItem("data"));
      }
    };

    // Whenever there is change in profile image of employee the image is updated
    const handleImageChange = (e) => {
      try{
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      var size = e.target.files[0].size;
      if(size/1000>71){
        toast.error("Upload an image with file size less than 71kb");
        return false
      }
      reader.onload = () => {
        setImage(reader.result);
        setd({
          ...d,
          [image]: reader.result,
        })
        sessionStorage.setItem("data",JSON.stringify({
          ...d,
          [image]: reader.result,
        }))
      };
     reader.onerror = error => {
      }}catch{
  
      }
    };
    
    if (!isVisible) {
      return null; // If isVisible is false, return null to render nothing
    }

  const close=()=>{setHam(false)}
  const open=()=>{setHam(true)}
  return (


    <div className="w-full h-screen flex">
      <ToastContainer />
      <Sidebar ham={ham} setHam={close}/>
      <div className={ham?"bg-transparent sticky left-64  w-5/6 z-10":'bg-transparent  w-full z-10'}>
        {ham?<></>:<RxHamburgerMenu className="ml-4 hover:cursor-pointer mt-4 text-3xl" onClick={()=>{setHam(true)}}/>}
        <div className="flex flex-col  items-center justify-center px-6 py-3 mx-auto md:h-screen lg:py-0">
        <div className="w-full flex border-slate-400 border-2 flex-col items-center rounded-md  min-h-[420px] min-w-[550px]  md:mt-0 sm:max-w-md xl:p-0 relative">
          <div className='mt-4'>
            {image!==null?
            <div className='relative'>
            <img src={image} className="w-32 h-32 object-scale-down rounded-full" onClick={() => { const inputElement = document.getElementById('image1');if (inputElement) {   inputElement.click();  }}}/>
            <input
                type="file"
                name="image1"
                id="image1"
                className="hidden" accept="image/*"
                disabled={!isEditable} // Disable if not editable
                onChange={(e) => handleImageChange(e)}
                onClick={(e) => handleImageChange(e)}

                required=""
              />
              </div>
            
            :
            <>
            <input
                type="file"
                name="image"
                id="image"
                className="hidden" accept="image/*"
                disabled={!isEditable} // Disable if not editable
                onChange={(e) => handleImageChange(e)}

                required=""
              />
          {JSON.parse(sessionStorage.getItem('data')).image!==null?<img src={JSON.parse(sessionStorage.getItem('data')).image} className="w-32 h-30  rounded-full" onClick={() => { const inputElement = document.getElementById('image');if (inputElement) {   inputElement.click();  }}} ></img>:<FaUser className="w-28 h-28 object-scale-down  rounded-full border-black border-2" onClick={() => { const inputElement = document.getElementById('image');if (inputElement) {   inputElement.click();  }}}/>}
          </>
        }
          </div>
        <div className="w-full px-2 space-y-4 md:space-y-4 sm:p-8">
          <form className="space-y-4 pt-4 md:space-y-2" action="#">
          
            <div className="flex w-full gap-5">
           <div className="flex flex-col gap-5 w-full">
           <div className=''>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                value={isEditable ? d.name|| '' : d.name || ''}
                disabled={!isEditable} // Disable if not editable
                onChange={(e) => handleInputChange(e)}

                required=""
              />
            </div>
           
            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Gender
              </label>
              <input
                type="text"
                name="gender"
                id="gender"
                value={isEditable ? d.gender || '' : d.gender || ''}
                                      disabled={!isEditable} // Disable if not editable
                                      onChange={(e) => handleInputChange(e)}

                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                required=""
              />
              
            </div>
            
             <div>
              <label
                htmlFor="address"
                className="block mb-2  text-sm font-medium text-gray-900 "
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={isEditable ? d.address || '' : d.address || ''}
                                      disabled={!isEditable} // Disable if not editable
                                      onChange={(e) => handleInputChange(e)}

                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                required=""
              />
            </div>
            
           </div>
           
           
            <div className='flex flex-col gap-5 w-full'>
          
             <div>
               <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                value={isEditable ? d.email || '' : d.email || ''}
                                      disabled={!isEditable} // Disable if not editable
                                      onChange={(e) => handleInputChange(e)}

                required=""
              />
             </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Phone
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                value={isEditable ? d.phone_number || '' : d.phone_number || ''}
                                      disabled={!isEditable} // Disable if not editable
                                      onChange={(e) => handleInputChange(e)}

                required=""
              />
            </div>
            <div>
               <label
                htmlFor="age"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                value={isEditable ? d.age || '' : d.age || ''}
                                      disabled={!isEditable} // Disable if not editable
                                      onChange={(e) => handleInputChange(e)}
                required=""
              />
             </div>
           
            </div>
            </div>
            
            <div className="flex gap-8 pt-7">
                {!isEditable && (
                  <button
                    type="button"
                    className='w-full  text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'     
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                )}
                {isEditable && (
                  <button
                    type="button"
                    className='w-full  text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'                             
                    onClick={handleSaveClick}
                  >
                    Save
                  </button>
                )}
              </div>
            
          </form>
        </div>
      </div>
      </div>
        
      
      </div>
    </div>
  )
}

export default Profile