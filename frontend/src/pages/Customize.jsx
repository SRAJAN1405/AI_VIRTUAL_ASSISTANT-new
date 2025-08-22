import React, { useContext, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { RiImageAddLine } from "react-icons/ri";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);
  const navigate = useNavigate();

  const inputImage = React.useRef(null);
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04044f] flex justify-center items-center flex-col p-[20px] relative">
      <IoMdArrowBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]">
        <h1 className="text-white mb-[20px] text-[30px] text-center">
          Select your <span className="text-blue-200">Assistant Image</span>
        </h1>
        <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
          {" "}
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />
          <Card image={image7} />
          <div
            className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff54] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
              selectedImage === "input"
                ? "border-4 border-white shadow-2xl shadow-blue-950"
                : null
            } `}
            onClick={() => {
              inputImage.current.click();
              setSelectedImage("input"); // Reset selected image when adding a new one
            }}
          >
            {!frontendImage && (
              <RiImageAddLine className="text-white w-[25px] h-[25px] " />
            )}
            {frontendImage && (
              <img src={frontendImage} className="h-full object-cover" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={inputImage}
            hidden
            onChange={handleImage}
          />
        </div>
        {selectedImage && (
          <button
            className="min-w-[150px]  mt-[15px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer"
            onClick={() => navigate("/customize2")}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Customize;
