import React from "react";
import { Link } from "react-router-dom";
import SettingsButton from "./SettingsButton"; // Import the SettingsButton component

function NavBar() {
  return (
    <>
      <header className="game-header">
        <div className="left-content">
          <Link to="/" className="game-title">Mexican Train Dominoes</Link>
        </div>
        <div className="right-content">
          <Link to="/settings"> {/* Link to the /settings page */}
            <SettingsButton /> {/* Render the SettingsButton component */}
          </Link>
        </div>
      </header>
      <style jsx>{`
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center; /* Center items vertically */
          color: #fff;
          padding: 10px 20px; /* Add padding to the header */
        }
        .left-content {
          /* Flex-grow removed */
        }
        .game-title {
          font-size: 40px; /* Adjusted font size */
          font-weight: 400;
          font-family: DM Serif Display, -apple-system, Roboto, Helvetica, sans-serif;
          margin: 0; /* Remove default margin */
          text-decoration: none; /* Remove default underline */
          color: #fff; /* Set color to white */
        }
        .right-content {
          /* Flex-grow removed */
        }
        .game-image {
          aspect-ratio: 1.01;
          object-fit: cover;
          width: 80px;
        }

        @media (max-width: 991px) {
          .game-title {
            font-size: 24px; /* Adjusted font size for smaller screens */
          }
        }
      `}</style>
    </>
  );
}

export default NavBar;
