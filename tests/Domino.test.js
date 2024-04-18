import React from "react";
import { render } from "@testing-library/react";
import Domino from "../src/components/Domino";
import { ConvertToReact } from "../src/components/Domino";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DetermineIfDominoIsSelectable } from "../src/components/Domino";

describe("Domino Component", () => {
  it("renders without crashing", () => {
    render(<Domino />);
  });

  test("renders domino images correctly for a 1,1 domino", () => {
    render(<Domino top={1} bottom={1} isSelected={true} onSelect={() => {}} />);
    const topImage = screen.getByRole("img", {
      name: "Top dots representing a number",
    });
    const bottomImage = screen.getByRole("img", {
      name: "Bottom dots representing a number",
    });
    expect(topImage).toHaveAttribute("src", "./assets/dots1.png");
    expect(bottomImage).toHaveAttribute("src", "./assets/dots1.png");
  });
});

describe("DetermineIfDominoIsSelectable function", () => {
  it("returns true for a selectable domino", () => {
    const paths = {
      player1: {
        Dominoes: [
          [1, 2],
          [2, 3],
          [3, 4],
        ],
      },
      player2: {
        Dominoes: [
          [5, 6],
          [6, 7],
          [7, 8],
        ],
      },
    };
    sessionStorage.setItem("Player Paths", JSON.stringify(paths));
    sessionStorage.setItem("Players", JSON.stringify(["player1", "player2"]));

    const domino = [4, 5];
    expect(DetermineIfDominoIsSelectable(domino)).toBe(true);
  });

  it("returns false for a domino with an input of 13", () => {
    const domino1 = [1, 13];
    expect(DetermineIfDominoIsSelectable(domino1)).toBe(false);
  });
});
