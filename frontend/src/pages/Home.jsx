// import React, { useContext } from "react";
// import { UserDataContext } from "../context/userContext";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useState } from "react";
// import { useRef } from "react";
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/user.gif";
// import { TiThMenu } from "react-icons/ti";
// import { RxCross1 } from "react-icons/rx";

// const Home = () => {
//   const { userData, serverUrl, setUserData, getGeminiResponse, loading } =
//     useContext(UserDataContext);
//   const navigate = useNavigate();
//   const [userText, setUserText] = useState("");
//   const [ham, setHam] = useState(false);
//   const [aiText, setAiText] = useState("");
//   const [listening, setListening] = useState(false);
//   const isSpeakingRef = useRef(false);
//   const recognitionRef = useRef(null);
//   const isRecognizingRef = useRef(false);
//   const synth = window.speechSynthesis;

//   const handleLogout = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/auth/logout`, {
//         withCredentials: true,
//       });
//       navigate("/signup");
//       setUserData(null);
//     } catch (error) {
//       setUserData(null);
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.lang = "en-US";
//     recognitionRef.current = recognition;
//     // const isRecognizingRef = { current: false };

//     recognition.onstart = () => {
//       console.log("Recognition started");
//       isRecognizingRef.current = true;
//       setListening(true);
//     };
//     recognition.onend = () => {
//       console.log("Recognition ended");
//       isRecognizingRef.current = false;
//       setListening(false);
//       // if (!isSpeakingRef.current) {
//       //   setTimeout(() => {
//       //     safeRecognition();
//       //   }, 1000); //delay rapid loop
//       // }
//     };

//     recognition.onerror = (event) => {
//       console.error("Recognition error:", event.error);
//       isRecognizingRef.current = false;
//       setListening(false);

//       if (event.error === "aborted" && !isSpeakingRef.current) {
//         // If recognition is aborted, restart it after a short delay
//         setTimeout(() => {
//           safeRecognition();
//         }, 1000);
//       }
//     };

//     const safeRecognition = () => {
//       try {
//         if (!isSpeakingRef.current && !isRecognizingRef.current) {
//           recognition.start();
//           // console.log("Recognition started");
//         }
//       } catch (error) {
//         if (error.name === "InvalidStateError") {
//           console.error("Start error:", error);
//         }
//       }
//     };
//     safeRecognition();

//     recognition.onresult = async (event) => {
//       const transcript =
//         event.results[event.results.length - 1][0].transcript.trim();
//       // console.log("Transcript:", transcript);
//       if (
//         transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
//       ) {
//         setUserText(transcript);
//         setAiText("");
//         recognition.stop();
//         isRecognizingRef.current = false;
//         setListening(false);
//         const data = await getGeminiResponse(transcript);
//         console.log(data);
//         setAiText(data?.response);
//         setUserText("");
//         handleCommand(data);
//       }
//     };
//     const fallback = setInterval(() => {
//       if (!isSpeakingRef.current && !isRecognizingRef.current) {
//         recognition.start();
//         // console.log("Recognition started");
//       }
//     }, 10000); // Check every 10 seconds
//     const greeting = new SpeechSynthesisUtterance(
//       `Hello ${userData.name}, what can I help you with?`
//     );
//     greeting.lang = "hi-IN";
//     window.speechSynthesis.speak(greeting);

//     return () => {
//       recognition.stop();
//       setListening(false);
//       isRecognizingRef.current = false;
//       clearInterval(fallback);
//       // console.log("Recognition stopped");
//     };
//   }, []);

//   const speak = (text) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "hi-IN";
//     const voices = window.speechSynthesis.getVoices();
//     // console.log("voices", voices);
//     const hindiVoice = voices.find((voice) => voice.lang === "hi-IN");
//     console.log("Hindi Voice:", hindiVoice);
//     if (hindiVoice) {
//       utterance.voice = hindiVoice;
//     }
//     isSpeakingRef.current = true;

//     utterance.onend = () => {
//       isSpeakingRef.current = false;
//       recognitionRef.current?.start();
//       setAiText("");
//     };
//     synth.speak(utterance);
//   };

//   const handleCommand = async (data) => {
//     // console.log("Command Data:", data);
//     const { type, userInput, response } = data;
//     speak(response);
//     if (type == "google-search") {
//       const query = encodeURIComponent(userInput);
//       window.open(`https://www.google.com/search?q=${query}`, "_blank");
//     }
//     if (type == "calculator-open") {
//       window.open("https://www.google.com/search?q=calculator", "_blank");
//     }
//     if (type == "instagram-open") {
//       window.open("https://www.instagram.com", "_blank");
//     }
//     if (type == "facebook-open") {
//       window.open("https://www.facebook.com", "_blank");
//     }
//     if (type == "youtube-search") {
//       const query = encodeURIComponent(userInput);
//       window.open(
//         `https://www.youtube.com/results?search_query=${query}`,
//         "_blank"
//       );
//     }
//     if (type == "youtube-play") {
//       const query = encodeURIComponent(userInput);
//       window.open(
//         `https://www.youtube.com/results?search_query=${query}`,
//         "_blank"
//       );
//     } else if (type == "weather-show") {
//       const query = encodeURIComponent(userInput);
//       window.open(`https://www.google.com/search?q=${query}`, "_blank");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04044f] flex justify-center items-center">
//         <h1 className="text-white text-[30px] font-semibold">Loading...</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04044f] flex justify-center items-center flex-col gap-[15px] overflow-hidden">
//       <TiThMenu
//         className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
//         onClick={() => setHam(!ham)}
//       />
//       <div
//         className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start overflow-hidden ${
//           ham ? "translate-x-0" : "translate-x-full"
//         } transition-transform`}
//       >
//         <RxCross1
//           className=" text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
//           onClick={() => setHam(!ham)}
//         />
//         <button
//           className="min-w-[150px]   h-[60px] bg-white  rounded-full text-black font-semibold text-[19px] cursor-pointer"
//           onClick={() => handleLogout()}
//         >
//           Log Out
//         </button>
//         <button
//           className="min-w-[150px]   h-[60px] bg-white  rounded-full text-black font-semibold text-[19px] px-[20px] py-[10px] cursor-pointer"
//           onClick={() => navigate("/customize ")}
//         >
//           Customize your Assistant
//         </button>
//         <div className="w-full h-[2px] bg-gray-400"></div>
//         <h1 className="text-white font-semibold text-[19px]">History</h1>

//         <div className="w-full h-[500px] gap-[20px] overflow-y-auto flex flex-col">
//           {userData.history?.map((his, idx) => (
//             <div key={idx} className="w-full max-w-full">
//               <span className="text-white text-[18px] truncate block w-full">
//                 {his}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//       <button
//         className="min-w-[150px]  mt-[30px] h-[60px] bg-white absolute hidden lg:block top-[20px] right-[20px] rounded-full text-black font-semibold text-[19px] cursor-pointer"
//         onClick={() => handleLogout()}
//       >
//         Log Out
//       </button>
//       <button
//         className="min-w-[150px]  mt-[30px] h-[60px] bg-white absolute hidden lg:block top-[100px] right-[20px] rounded-full text-black font-semibold text-[19px] px-[20px] py-[10px] cursor-pointer"
//         onClick={() => navigate("/customize ")}
//       >
//         Customize your Assistant
//       </button>

//       <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl">
//         <img
//           src={userData?.assistantImage}
//           alt=""
//           className="h-full object-cover "
//         />
//       </div>
//       <h1 className="text-white text-[18px] font-semibold">
//         I'm {userData?.assistantName}
//       </h1>
//       {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
//       {aiText && <img src={aiImg} alt="" className="w-[200px]" />}
//       {/* {console.log("Text", userText, aiText)} */}
//       <h1 className="text-white text-">
//         {userText ? userText : aiText ? aiText : null}
//       </h1>
//     </div>
//   );
// };

// export default Home;
import React, { useContext, useEffect, useState, useRef } from "react";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse, loading } =
    useContext(UserDataContext);
  const navigate = useNavigate();
  const [userText, setUserText] = useState("");
  const [ham, setHam] = useState(false);
  const [historyHam, setHistoryHam] = useState(false);
  const [aiText, setAiText] = useState("");
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      navigate("/signup");
      setUserData(null);
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error === "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    const safeRecognition = () => {
      try {
        if (!isSpeakingRef.current && !isRecognizingRef.current) {
          recognition.start();
        }
      } catch (error) {
        if (error.name === "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    };
    safeRecognition();

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setUserText(transcript);
        setAiText("");
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        setAiText(data?.response);
        setUserText("");
        handleCommand(data);
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        recognition.start();
      }
    }, 10000);

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, what can I help you with?`
    );
    greeting.lang = "hi-IN";
    window.speechSynthesis.speak(greeting);

    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, [userData, getGeminiResponse]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((voice) => voice.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      recognitionRef.current?.start();
      setAiText("");
    };
    synth.speak(utterance);
  };

  const handleCommand = async (data) => {
    const { type, userInput, response } = data;
    speak(response);
    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    } else if (type === "calculator-open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    } else if (type === "instagram-open") {
      window.open("https://www.instagram.com", "_blank");
    } else if (type === "facebook-open") {
      window.open("https://www.facebook.com", "_blank");
    } else if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    } else if (type === "weather-show") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-t from-black to-[#04044f] flex justify-center items-center">
        <h1 className="text-white text-3xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#04044f] flex flex-col items-center justify-center gap-4 overflow-hidden relative">
      {/* Hamburger Menu for sm and md */}
      <TiThMenu
        className="md:block lg:hidden text-white absolute top-5 right-5 w-6 h-6 cursor-pointer"
        onClick={() => setHam(true)}
      />
      {/* Sidebar for sm and md */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-[#00000080] backdrop-blur-lg p-5 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out lg:hidden ${
          ham ? "translate-x-0" : "translate-x-full"
        } z-50  `}
      >
        <RxCross1
          className="text-white w-6 h-6 cursor-pointer self-end"
          onClick={() => setHam(false)}
        />
        <button
          className="w-full h-12 bg-white rounded-full text-black font-semibold text-lg hover:bg-gray-200 transition "
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button
          className="w-full h-12 bg-white rounded-full text-black font-semibold text-lg hover:bg-gray-200 transition "
          onClick={() => navigate("/customize")}
        >
          Customize Assistant
        </button>
        <div className="w-full h-px bg-gray-400 "></div>
        <h1 className="text-white font-semibold text-lg ">History</h1>
        <div className="w-full h-[80%] gap-[20px] overflow-y-auto flex flex-col  hide-scrollbar">
          {userData.history?.map((his, idx) => (
            <div key={idx} className="w-full">
              <span className="text-white text-base truncate block">{his}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Buttons for lg */}
      <button
        className="hidden lg:block min-w-[150px] h-12 bg-white absolute top-[20px] right-[20px] rounded-full text-black font-semibold text-lg hover:bg-gray-200 transition"
        onClick={handleLogout}
      >
        Log Out
      </button>
      <button
        className="hidden lg:block min-w-[150px] h-12 p-[12px] bg-white absolute top-[100px] right-[20px] rounded-full text-black font-semibold text-lg hover:bg-gray-200 transition"
        onClick={() => navigate("/customize")}
      >
        Customize Assistant
      </button>
      {/* History Icon for lg */}
      <button
        className="hidden lg:block min-w-[150px] h-12 p-[12px] bg-white absolute top-[20px] left-[20px] rounded-full text-black font-semibold text-lg hover:bg-gray-200 transition"
        onClick={() => setHistoryHam(true)}
      >
        See History
      </button>
      {/* History Sidebar for lg */}
      <div
        className={`fixed inset-y-0 left-0 w-[30%] bg-[#00000080] backdrop-blur-lg p-5 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out hidden lg:block ${
          historyHam ? "translate-x-0" : "-translate-x-full"
        } z-50 `}
      >
        <RxCross1
          className="text-white w-6 h-6 cursor-pointer self-end"
          onClick={() => setHistoryHam(false)}
        />
        <h1 className="text-white font-semibold text-lg mt-[20px]">History</h1>
        <div className="w-full h-[500px] gap-[20px] overflow-y-auto flex flex-col mt-[20px] hide-scrollbar">
          {userData.history?.map((his, idx) => (
            <div key={idx} className="w-full max-w-full">
              <span className="text-white text-[18px]  w-full">{his}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="w-72 h-96 flex justify-center items-center overflow-hidden rounded-3xl">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="h-full object-cover"
        />
      </div>
      <h1 className="text-white text-lg font-semibold">
        I'm {userData?.assistantName}
      </h1>
      <img src={aiText ? aiImg : userImg} alt="Status" className="w-48" />
      <h1 className="text-white text-lg max-w-md text-center">
        {userText || aiText || "Say my name to start talking!"}
      </h1>
    </div>
  );
};

export default Home;
