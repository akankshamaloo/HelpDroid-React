import React, { useState, useEffect } from "react";
import axios from "axios";

function DisplayImages() {
  const [images, setImages] = useState([]);
  const [email, setEmail] = useState(""); // Assuming you have a way to set this

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/get-prescription-images?email=${encodeURIComponent(
            email
          )}`
        );
        setImages(response.data.images);
      } catch (error) {
        console.error("Failed to fetch images", error);
      }
    };

    if (email) {
      fetchImages();
    }
  }, [email]); // Fetch images when email changes

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
      />
      {/* <button onClick={fetchImages}>Load Images</button> */}
      <div>
        {images.map((imagePath, index) => (
          <div key={index}>
            <img
              src={`http://localhost:5000/${imagePath}`}
              alt="Decrypted Prescription"
              style={{ width: "200px", height: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayImages;
