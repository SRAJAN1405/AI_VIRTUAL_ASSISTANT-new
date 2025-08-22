import React, { useContext, useState } from "react";
import { UserDataContext } from "../context/userContext";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(UserDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleUpdateAssistant = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      //image ko bhejne ke liye form data m append krke bhejte hai..
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      setUserData(result.data.user);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04044f] flex justify-center items-center flex-col p-[20px] relative">
      <IoMdArrowBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => {
          navigate("/customize");
        }}
      />
      <h1 className="text-white mb-[20px] text-[30px] text-center">
        Enter Your <span className="text-blue-200">Assistance Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg. luci "
        className="w-full max-w-[600px] h-[60px] ouline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />
      {assistantName && (
        <button
          className="min-w-[300px]  mt-[15px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer"
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
          {" "}
          {!loading ? "Finally Create Your Assistance" : "Loading..."}
        </button>
      )}
    </div>
  );
};

export default Customize2;
