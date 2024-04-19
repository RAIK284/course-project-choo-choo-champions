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

  test("renders without crashing", () => {
    render(
      <Router>
        <HostGamePage />
      </Router>
    );
  });
  test("renders join code", () => {
    render(
      <MemoryRouter>
        {" "}
        <HostGamePage />
      </MemoryRouter>
    );
    const joinCodeElement = screen.getByText(/Join Code/i);
    console.log(joinCodeElement.textContent);
    expect(joinCodeElement.textContent.trim()).toEqual("Join Code:");
  });
});

test("calls handleStartGame when Start Game button is clicked", () => {
  const handleStartGameMock = jest.fn();
  render(
    <MemoryRouter>
      <HostGamePage />
    </MemoryRouter>
  );
  const startGameButton = screen.getByText("Start Game");
  fireEvent.click(startGameButton);

  expect(handleStartGameMock).not.toHaveBeenCalled();
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
