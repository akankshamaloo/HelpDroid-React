// This is admin_profile where the admin can edit  his details

// This code is contributed by Sagar

// Here we have imported the necessary libraries and files
import React,{useEffect,useState} from 'react';
import axios from "axios";
import { RxHamburgerMenu,RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { FaCamera, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Component to display an admin profile

const Profile = ({profilevalue,onUpdateProfile,func}) => {


  // These are the usestate hooks where we initialise the initial and the updates values
    const [image, setImage] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isEditable, setIsEditable] = useState(false); 
    const [editedProfile, setEditedProfile] = useState({ ...profilevalue });
    const [d,setd]=useState(JSON.parse(sessionStorage.getItem("data")))



    const n=useNavigate(); // usenavigate hook to navigate to another page


    useEffect(
      ()=>{
        setd(JSON.parse(sessionStorage.getItem("data")))
        
        if(sessionStorage.getItem('auth')==="false"){
          n('/')
        }
      },[]
    )

  
    useEffect(() => {
      setEditedProfile({ ...profilevalue }); // Update edited profile when profilevalue changes
    }, [profilevalue]);


    // function to use cross icon and remove the component if that is clicked
  
    const handleCrossClick = () => {
      func()
      setIsVisible(false);
    };
  

    // function to make the input values editable
    const handleEditClick = () => {
      setIsEditable(true);
    };

        // function to save the edited input values 
  
    const handleSaveClick = () => {
      setIsEditable(false);
      onUpdateProfile(editedProfile); // Update profile value in parent component
      handleInputChange({ target: { name: '', value: '' } });
      updateDatabase();
    };
    


    // function to update the edited values in the database
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
        const url = `http://localhost:3000/users/${named}`;
       
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
        
        
       
        if(response.status===200){
          
         toast.success('updated successfully');

        }
        
        }
        catch(error){
          toast.error(error.message)
        }
    } 



    // function to handle the change in the input fields
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

// function to handle the changed image

    const handleImageChange = (e) => {
      try{
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      var size = e.target.files[0].size;
      if(size/1000>52){
        toast.error("Upload an image with file size less than 50kb");
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



  return (

    <div >

     {/* toast container to display the toast messages */}

      <ToastContainer />
      <section className=" ">
    <div className="flex flex-col items-center justify-center px-6 py-1 mx-auto md:h-screen lg:py-0">
    
      <div className="w-full bg-white border border-slate-300 rounded-md shadow min-h-[420px] min-w-[550px]  md:mt-0 sm:max-w-md xl:p-0 relative">
          <div className='absolute top-2 right-2 mt-2 mr-2 hover:bg-slate-400 hover:text-white rounded-full p-1'>

            {/* cross icon to handle that cross profile functionality */}

            <RxCross2 className='text-2xl'onClick={handleCrossClick}/>
          </div>
          <div className='flex justify-center pt-4'>
            {image!==null?
            <div className='relative p-0'>
            <img src={image} className="w-32 h-32 object-scale-down shadow-lg rounded-full" onClick={() => { const inputElement = document.getElementById('image1');if (inputElement) {   inputElement.click();  }}}/>
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
          {JSON.parse(sessionStorage.getItem('data')).image!==null?<img src={JSON.parse(sessionStorage.getItem('data')).image} className="w-32 h-32 object-scale-down shadow-lg rounded-full" onClick={() => { const inputElement = document.getElementById('image');if (inputElement) {   inputElement.click();  }}} ></img>:<FaUser className="w-32 h-32 object-scale-down shadow-lg rounded-full border-black border-2"  onClick={() => { const inputElement = document.getElementById('image');if (inputElement) {   inputElement.click();  }}}/>}
          </>
        }
          </div>

{/* displaying the user details  */}

        <div className="px-2 space-y-4 md:space-y-4 sm:p-8">
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
            {/* edit and save button for handling the changed input values */}
            
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
                    className='w-full  text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'                             onClick={handleSaveClick}
                  >
                    Save
                  </button>
                )}
              </div>
            
          </form>
        </div>
      </div>
    </div>
  </section> 
      
    </div>
    
  
  )
}

export default Profile
