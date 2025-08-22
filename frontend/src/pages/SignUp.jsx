import React, { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import bg from "../assets/authBg.png"; // Ensure the path is correct
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserDataContext } from "../context/userContext";
import axios from "axios";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); // Added error state to handle errors
  const [loading, setLoading] = useState(false); // Added loading state
  const { serverUrl, userData, setUserData } = useContext(UserDataContext);
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all the fields");
      return;
    }
    setLoading(true); // Set loading state to true
    setErr(""); // Reset error state before making the request
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );
      setLoading(false); // Set loading state to false after request
      setUserData(result.data); // Assuming setUserData is available in context
      navigate("/customize"); 
    } catch (error) {
      setUserData(null); // Clear user data on error
      setLoading(false); // Set loading state to false if there's an error
      setErr(error.response.data.message); // Set error message from response
    }
  };
  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="w-[90%] h-[500px] max-w-[500px] bg-[#00000062] backdrop-blur-md shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] mb-[30px] px-[20px]">
        <h1 className="text-white text-[30px] font-semibold mt-[14px]">
          Register To <span className="text-blue-500">Virtual Assistant</span>
        </h1>
        <input
          type="text"
          placeholder="Enter Your Name"
          className="w-full h-[60px] ouline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email@gmail.com"
          className="w-full h-[60px] ouline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] pr-[50px]" // Added pr-[50px] for spacing
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          ) : (
            <IoEye
              className="absolute right-[20px] top-1/2 transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          )}
        </div>
        {err.length > 0 && (
          <p className="text-red-500  mt-[10px] text-[17px]">*{err}</p>
        )}
        <button
          className="min-w-[150px]  mt-[15px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] "
          onClick={handleSignUp}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <p
          className="text-[white] text-[18px] cursor-pointer mb-[20px]"
          onClick={() => navigate("/signin")}
        >
          Already have an account ?
          <span className="text-blue-400"> SignIn</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
