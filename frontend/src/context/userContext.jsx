import axios from "axios";
import React, { useEffect, useState } from "react";

export const UserDataContext = React.createContext();

function UserContext({ children }) {
  const serverUrl = "https://ai-virtual-assistant-im12.onrender.com";
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUserData = async () => {
    try {
      console.log("Fetching userData, current userData:", userData);
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      console.log("result data", result.data);
      setUserData(result?.data);
    } catch (error) {
      console.error("Error fetching userData:", error);
      setUserData(null);
    } finally {
      setLoading(false); // Set loading to false after fetch completes
    }
  };
  const getGeminiResponse = async (promptUser) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/ask_to_assistant`,
        { promptUser },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log("Error in getGeminiResponse:", error);
    }
  };

  useEffect(() => {
    handleUserData();
  }, []);

  // Log userData when it changes
  useEffect(() => {
    console.log("userData updated:", userData);
  }, [userData]);

  const value = {
    serverUrl,
    userData,
    setUserData,
    loading, // Include loading in context
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;
