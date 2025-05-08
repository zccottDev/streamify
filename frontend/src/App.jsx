import React from "react";
import { Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Notifications from "./pages/Notifications.jsx";
import Call from "./pages/Call.jsx";
import Chat from "./pages/Chat.jsx";
import Onboarding from "./pages/Onboarding.jsx";

const App = () => {
  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/call" element={<Call />} />
        <Route path="/chat" element={<Chat />}/>
        <Route path="/onboarding" element={<Onboarding />}/>
      </Routes>
    </div>
  );
};

export default App;
