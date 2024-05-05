// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/login/HomePage";
import SignUpPage from "./components/profile/SignupPage";
import TrainSelector from "./components/trains/TrainSelector";
import NavBar from "./components/universal/NavBar";
import Background from "./components/universal/Background";
import SettingsButton from "./components/universal/SettingsButton";
import JoinCodePage from "./components/gameplay/join/JoinCodePage";
import Profile from "./components/profile/Profile";
import ChangePassword from "./components/profile/ChangePassword";
import DashboardPage from "./components/profile/DashboardPage";
import DominoBank from "./components/gameplay/dominoes/DominoBank";
import Domino from "./components/gameplay/dominoes/Domino";
import GameBase from "./components/gameplay/GameBase";
import EmailVerification from "./components/profile/EmailVerification";
import GameLogic from "./components/gameplay/GameLogic";
import HostGamePage from "./components/gameplay/host/HostGamePage";
import MultiGameBase from "./components/gameplay/MultiGameBase";
import { Initialize } from "./Firebase";

function App() {
  Initialize();
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />{" "}
        <Route path="/trains" element={<TrainSelector />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path="/background" element={<Background />} />
        <Route path="/settingsbutton" element={<SettingsButton />} />
        <Route path="/join" element={<JoinCodePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dominobank" element={<DominoBank />} />
        <Route path="/domino" element={<Domino />} />
        <Route path="/gamebase" element={<GameBase />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/gamelogic" element={<GameLogic />} />
        <Route path="/host" element={<HostGamePage />} />
        <Route path="/multiplayer" element={<MultiGameBase />} />
      </Routes>
    </Router>
  );
}

export default App;
