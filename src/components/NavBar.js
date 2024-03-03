import React from "react";

function NavBar() {
  return (
    <>
      <header className="game-header">
        <div className="left-content">
          <h1 className="game-title">Mexican Train Dominoes</h1>
        </div>
      </header>
      <style jsx>{`
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center; /* Center items vertically */
          color: #fff;
        }
        .left-content {
          flex-grow: 1; /* Left content takes up remaining space */
        }
        .game-title {
          font-size: 40px; /* Adjusted font size */
          font-weight: 400;
          font-family: DM Serif Display, -apple-system, Roboto, Helvetica, sans-serif;
          margin: 0; /* Remove default margin */
        }
        .right-content {
          margin-left: auto; /* Right content moves to the right */
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
