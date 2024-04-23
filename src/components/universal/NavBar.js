import React from "react";
import { Link } from "react-router-dom";
import SettingsButton from "../universal/SettingsButton";
import "./NavBar.css";

function NavBar() {
  return (
    <header className="game-header">
      <div className="left-content">
        <Link to="/dashboard" className="game-title">
          Mexican Train Dominoes
        </Link>
      </div>
      <div className="right-content">
        <Link to="/profile" className="settings-link">
          <SettingsButton />
        </Link>
      </div>
    </header>
  );
}

export default NavBar;
