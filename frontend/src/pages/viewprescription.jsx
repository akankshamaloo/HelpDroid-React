import React, { useState, useEffect } from "react";
import axios from "axios";

function DisplayImages() {
  const [images, setImages] = useState([]);
  const [email, setEmail] = useState(""); // Assuming you have a way to set this

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/get-prescription', {
          'email': sessionStorage.getItem("user_email") // Assuming you have a way to set this
        }
        );
        console.log(response.data);
        setImages(response.data);
      } catch (error) {
        console.error("Failed to fetch images", error);
      }
    };


    fetchImages();

  }, []); // Fetch images when email changes

  return (
    <div>

      {/* <button onClick={fetchImages}>Load Images</button> */}
      <div>
        {images?.data?.map((base64Image, index) => (
          <div key={index}>
            <img src={`data:image/png;base64,${base64Image}`} alt="Decrypted Prescription" style={{ width: '200px', height: 'auto' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayImages;
