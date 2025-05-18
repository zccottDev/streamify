import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Notifications from "./pages/Notifications.jsx";
import Call from "./pages/Call.jsx";
import Chat from "./pages/Chat.jsx";
import Onboarding from "./pages/Onboarding.jsx";

import { Toaster } from "react-hot-toast";
import useAuthUser from "./hooks/useAuthUser.js";
import Loader from "./components/Loader.jsx";

const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;


  if (isLoading) return <Loader />;
  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? <Home /> :  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/call" element={<Call />} />
        <Route path="/chat" element={<Chat />}/>
        <Route path="/onboarding" element={<Onboarding />}/>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
