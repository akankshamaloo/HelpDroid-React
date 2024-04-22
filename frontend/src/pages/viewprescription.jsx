import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../index.css"; // Make sure to create this CSS file
import FullScreenLoader from "../components/Loading";
function DisplayImages() {
  const [images, setImages] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/get-prescription",
          {
            email: sessionStorage.getItem("user_email"),
          }
        );
        console.log(response.data);
        setImages(response.data?.data);
      } catch (error) {
        console.error("Failed to fetch images", error);
      } finally {
        setLoading(false);
      }
    };
    console.log("useeffect");

    fetchImages();
  }, []);

  const handleDelete = async (index) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/delete-prescription",
        {
          email: sessionStorage.getItem("user_email"),
          index: index, // Send the index of the image to be deleted
        }
      );
      if (response.status === 200) {
        console.log("images", images);
        setImages((prevImages) => {
          if (!Array.isArray(prevImages)) {
            console.error(
              "Expected an array, but received:",
              typeof prevImages
            );
            return []; // Fallback to an empty array if not an array
          }
          return prevImages.filter((_, i) => i !== index);
        });
      } else {
        console.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const handleDownload = (base64Image) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${base64Image}`;
    link.download = "download.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = (base64Image) => {
    setViewImage(`data:image/png;base64,${base64Image}`);
  };

  const closeModal = () => {
    setViewImage(null);
  };
  if (loading)
    return (
      <div className="container">
        <Sidebar OpenSidebar={true} style={{ height: "100vh" }} />
        <FullScreenLoader />
      </div>
    );

  return (
    <div className="container">
      <Sidebar OpenSidebar={true} style={{ height: "100vh" }} />
      <div className="gallery">
        {images?.map((base64Image, index) => (
          <div key={index} className="image-card">
            <img
              src={`data:image/png;base64,${base64Image}`}
              alt="Decrypted Prescription"
              onClick={() => openModal(base64Image)}
            />
            <div className="image-actions">
              <button
                className="button"
                onClick={() => handleDelete(index)}
                style={{ color: "red" }}
              >
                Delete
              </button>
              <button
                className="button"
                onClick={() => handleDownload(base64Image)}
                style={{ color: "red" }}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
      {viewImage && (
        <div className="modal">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <img src={viewImage} alt="Zoomed In" className="modal-content" />
        </div>
      )}
    </div>
  );
}

export default DisplayImages;
