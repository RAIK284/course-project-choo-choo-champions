import React from "react";
import { render } from "@testing-library/react";
import Domino from "../src/components/Domino";

describe("Domino Component", () => {
  it("renders without crashing", () => {
    render(<Domino />);
  });
});
