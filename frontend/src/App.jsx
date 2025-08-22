import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Customize from "./pages/Customize.jsx";
import { useContext } from "react";
import { UserDataContext } from "./context/userContext.jsx";
import Customize2 from "./pages/Customize2.jsx";
import Home from "./pages/Home.jsx";

const App = () => {
  const { userData, setUserData, loading } = useContext(UserDataContext);
  if (loading) {
    return (
      <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#04044f] flex justify-center items-center">
        <h1 className="text-white text-[30px] font-semibold">Loading...</h1>
      </div>
    );
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          userData &&
          userData?.assistantImage?.length > 0 &&
          userData?.assistantName?.length > 0 ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to={"/customize"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <SignIn /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/signup"} />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
      />
    </Routes>
  );
};

export default App;
