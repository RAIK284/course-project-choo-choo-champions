import React, { useState, useEffect } from "react";
import NavBar from "../../universal/NavBar";
import Background from "../../universal/Background";
import "./JoinCodePage.css";

function JoinCodePage() {
  const [joinCode, setJoinCode] = useState("");
  const [ws, setWs] = useState(null);
  const [joinedGame, setJoinedGame] = useState(false);

    useEffect(() => {
        // Create a new WebSocket connection
        // LocalHost
        const newWs = new WebSocket('ws://localhost:8765');
        // Production
        // const newWs = new WebSocket('ws://34.125.63.8:3389');

    newWs.onopen = () => {
      console.log("WebSocket connection established");
      setWs(newWs);
    };

    newWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "redirect" && message.url === "/trains") {
        window.location.href = message.url;
      }
    };

    newWs.onclose = () => {
      console.log("WebSocket connection closed");
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
    // eslint-disable-next-line
  }, []);

  const handleJoinGame = () => {
    // eslint-disable-next-line
    if (ws && joinCode.length == 6) {
      const username = sessionStorage.getItem("username");
      ws.send(
        JSON.stringify({ type: "joinGame", sessionId: joinCode, username })
      );
      setJoinedGame(true);
      alert("Wait for the host to start the game.");
    } else {
      // Alert for invalid join code
      alert("Invalid join code.");
    }
  };

  return (
    <div className="full-page">
      <Background />
      <NavBar />
      <div className="centered-content">
        <h2 className="enter-join-code">Enter Join Code</h2>
        <div className="container">
          <div className="join-input-container">
            <input
              type="text"
              placeholder="Enter join code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              readOnly={joinedGame}
              className="join-code-input"
            />
            <button
              className="confirm-join-code"
              onClick={handleJoinGame}
              disabled={joinedGame}
            >
              Join Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinCodePage;
