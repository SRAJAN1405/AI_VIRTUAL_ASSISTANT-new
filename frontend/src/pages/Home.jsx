import React, { useContext } from "react";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { TiThMenu } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse, loading } =
    useContext(UserDataContext);
  const navigate = useNavigate();
  const [userText, setUserText] = useState("");
  const [ham, setHam] = useState(false);
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
    // const isRecognizingRef = { current: false };

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };
    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
      // if (!isSpeakingRef.current) {
      //   setTimeout(() => {
      //     safeRecognition();
      //   }, 1000); //delay rapid loop
      // }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error === "aborted" && !isSpeakingRef.current) {
        // If recognition is aborted, restart it after a short delay
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    const safeRecognition = () => {
      try {
        if (!isSpeakingRef.current && !isRecognizingRef.current) {
          recognition.start();
          // console.log("Recognition started");
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
      // console.log("Transcript:", transcript);
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setUserText(transcript);
        setAiText("");
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        console.log(data);
        setAiText(data?.response);
        setUserText("");
        handleCommand(data);
      }
    };
    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        recognition.start();
        // console.log("Recognition started");
      }
    }, 10000); // Check every 10 seconds
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
      // console.log("Recognition stopped");
    };
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    // console.log("voices", voices);
    const hindiVoice = voices.find((voice) => voice.lang === "hi-IN");
    console.log("Hindi Voice:", hindiVoice);
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
    // console.log("Command Data:", data);
    const { type, userInput, response } = data;
    speak(response);
    if (type == "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type == "calculator-open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }
    if (type == "instagram-open") {
      window.open("https://www.instagram.com", "_blank");
    }
    if (type == "facebook-open") {
      window.open("https://www.facebook.com", "_blank");
    }
    if (type == "youtube-search") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
    if (type == "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    } else if (type == "weather-show") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04044f] flex justify-center items-center">
        <h1 className="text-white text-[30px] font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04044f] flex justify-center items-center flex-col gap-[15px] overflow-hidden">
      <TiThMenu
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
        onClick={() => setHam(!ham)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start overflow-hidden ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <RxCross1
          className=" text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
          onClick={() => setHam(!ham)}
        />
        <button
          className="min-w-[150px]   h-[60px] bg-white  rounded-full text-black font-semibold text-[19px] cursor-pointer"
          onClick={() => handleLogout()}
        >
          Log Out
        </button>
        <button
          className="min-w-[150px]   h-[60px] bg-white  rounded-full text-black font-semibold text-[19px] px-[20px] py-[10px] cursor-pointer"
          onClick={() => navigate("/customize ")}
        >
          Customize your Assistant
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-[500px] gap-[20px] overflow-y-auto flex flex-col">
          {userData.history?.map((his, idx) => (
            <div key={idx} className="w-full max-w-full">
              <span className="text-white text-[18px] truncate block w-full">
                {his}
              </span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="min-w-[150px]  mt-[30px] h-[60px] bg-white absolute hidden lg:block top-[20px] right-[20px] rounded-full text-black font-semibold text-[19px] cursor-pointer"
        onClick={() => handleLogout()}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px]  mt-[30px] h-[60px] bg-white absolute hidden lg:block top-[100px] right-[20px] rounded-full text-black font-semibold text-[19px] px-[20px] py-[10px] cursor-pointer"
        onClick={() => navigate("/customize ")}
      >
        Customize your Assistant
      </button>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover "
        />
      </div>
      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
      {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="w-[200px]" />}
      {/* {console.log("Text", userText, aiText)} */}
      <h1 className="text-white text-">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;
