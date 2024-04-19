import React from "react";
import { screen, render, fireEvent, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HostGamePage from "../src/components/HostGamePage";
import { MemoryRouter } from "react-router-dom";

describe("HostGamePage component", () => {
  beforeEach(() => {
    sessionStorage.setItem("username", "testUser");
  });
  afterEach(() => {
    sessionStorage.clear();
  });

  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  test("renders without crashing", () => {
    act(() => {
      render(
        <Router>
          <HostGamePage />
        </Router>
      );
    });
  });

  test("renders join code", () => {
    // Setup
    act(() => {
      render(
        <MemoryRouter>
          <HostGamePage />
        </MemoryRouter>
      );
    });
    // Execute
    const joinCodeElement = screen.getByText(/Join Code/i);
    // Test
    expect(joinCodeElement.textContent.trim()).toEqual("Join Code:");
  });

  test("calls handleStartGame when Start Game button is clicked", () => {
    // Setup
    const handleStartGameMock = jest.fn();
    const { assign } = window.location;
    delete window.location;
    window.location = { assign: jest.fn() };
    act(() => {
      render(
        <MemoryRouter>
          <HostGamePage />
        </MemoryRouter>
      );
    });

    // Execute
    const startGameButton = screen.getByText("Start Game");
    fireEvent.click(startGameButton);

    // Test
    expect(handleStartGameMock).not.toHaveBeenCalled();

    // Teardown
    window.location = { assign };
  });

  test("handles WebSocket onopen event correctly", () => {
    // Setup
    const mockWebSocket = {
      onopen: null,
      close: jest.fn(),
    };
    global.WebSocket = jest.fn(() => mockWebSocket);

    // Execute
    act(() => {
      render(
        <Router>
          <HostGamePage />
        </Router>
      );
    });

    // Test
    expect(mockWebSocket.onopen).not.toBeNull();
  });

  test("handles WebSocket onclose event correctly", () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation(() => { });

    // Setup
    const mockWebSocket = {
      onclose: null,
      close: jest.fn(),
    };
    global.WebSocket = jest.fn(() => mockWebSocket);

    // Execute and Test
    act(() => {
      render(
        <Router>
          <HostGamePage />
        </Router>
      );
    });

    // Test
    expect(mockWebSocket.onclose).not.toBeNull();

    // Teardown
    act(() => {
      mockWebSocket.onclose();
    });

    consoleLogMock.mockRestore();
  });

  test("handles WebSocket onerror event correctly", () => {
    // Setup
    const consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => { });

    const mockWebSocket = {
      onerror: null,
      close: jest.fn(),
    };
    global.WebSocket = jest.fn(() => mockWebSocket);

    // Execute and Test
    act(() => {
      render(
        <Router>
          <HostGamePage />
        </Router>
      );
    });

    // Test
    act(() => {
      mockWebSocket.onerror(new Error("WebSocket error"));
    });
    expect(consoleErrorMock).toHaveBeenCalledWith("WebSocket error:", expect.any(Error));

    // Teardown
    consoleErrorMock.mockRestore();
  });

  beforeEach(() => {
    global.WebSocket = jest.fn(() => ({
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      send: jest.fn(),
      close: jest.fn(),
    }));
  });

  afterEach(() => {
    global.WebSocket.mockClear();
  });

  test("handles WebSocket onmessage event correctly - playerJoined message", () => {
    // Setup
    const mockPlayerJoinedMessage = {
      type: "playerJoined",
      player: { username: "testPlayer", ready: true },
    };
    const mockWebSocketInstance = new WebSocket();
    global.WebSocket.mockImplementation(() => mockWebSocketInstance);

    // Execute
    act(() => {
      render(
        <Router>
          <HostGamePage />
        </Router>
      );
    });

    act(() => {
      mockWebSocketInstance.onopen();
    });

    act(() => {
      mockWebSocketInstance.onmessage({
        data: JSON.stringify(mockPlayerJoinedMessage),
      });
    });

    // Test
    expect(screen.getByText("testPlayer")).not.toBeNull();
  });

  test("handles WebSocket onmessage event correctly - sessionId message", () => {
    // Setup
    const mockSessionIdMessage = {
      type: "sessionId",
      sessionId: "testSessionId",
    };
    const mockWebSocketInstance = new WebSocket();
    global.WebSocket.mockImplementation(() => mockWebSocketInstance);

    // Execute
    act(() => {
      render(
        <Router>
          <HostGamePage />
        </Router>
      );
    });

    act(() => {
      mockWebSocketInstance.onopen();
    });

    act(() => {
      mockWebSocketInstance.onmessage({
        data: JSON.stringify(mockSessionIdMessage),
      });
    });

    // Test
    expect(screen.getByText("Join Code: testSessionId")).not.toBeNull();
  });

  test("does not attempt WebSocket connection if already initialized", () => {
    // Setup
    const mockWebSocketInstance = new WebSocket();
    global.WebSocket.mockImplementation(() => mockWebSocketInstance);

    // Execute
    render(
      <Router>
        <HostGamePage />
      </Router>
    );

    // Test
    expect(global.WebSocket).toHaveBeenCalledTimes(2);
  });

  test("calls ws.send with correct message on Start Game button click", () => {
    // Setup
    const mockWebSocketInstance = new WebSocket();
    global.WebSocket.mockImplementation(() => mockWebSocketInstance);

    const { assign } = window.location;
    delete window.location;
    window.location = { assign: jest.fn() };

    // Execute
    act(() => {
      render(
        <Router>
          <HostGamePage />
        </Router>
      );
    });

    act(() => {
      mockWebSocketInstance.onopen();
    });

    fireEvent.click(screen.getByText("Start Game"));

    // Test
    expect(mockWebSocketInstance.send).toHaveBeenCalledWith(
      JSON.stringify({ type: "startGame" })
    );

    window.location = { assign };
  });

  test("redirects to /trains when Start Game button is clicked", () => {
    // Setup
    delete window.location;
    window.location = { href: "" };
    const mockWebSocketInstance = new WebSocket();
    global.WebSocket = jest.fn(() => mockWebSocketInstance);

    // Execute
    render(
      <Router>
        <HostGamePage />
      </Router>
    );

    act(() => {
      mockWebSocketInstance.onopen();
    });

    fireEvent.click(screen.getByText("Start Game"));

    // Test
    expect(window.location.href).toBe("/trains");
  });
});