import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import HostGamePage from "../src/components/HostGamePage";

describe("HostGamePage component", () => {
  beforeEach(() => {
    sessionStorage.setItem("username", "testUser");
  });
  afterEach(() => {
    sessionStorage.clear();
  });
});

test("renders without crashing", () => {
  render(
    <Router>
      <HostGamePage />
    </Router>
  );
});
