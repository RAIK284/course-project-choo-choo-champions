import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Domino from "../src/components/Domino";
import { ConvertToReact, getColor } from "../src/components/Domino";
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DetermineIfDominoIsSelectable } from "../src/components/Domino";

// domino component (2)
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

// determine if domino is selectable (3)
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
    sessionStorage.setItem("Paths", JSON.stringify(paths));
    sessionStorage.setItem("Players", JSON.stringify(["player1", "player2"]));

    const domino = [4, 5];
    expect(DetermineIfDominoIsSelectable(domino)).toBe(true);
  });

  it("returns false for a domino with an input of 13", () => {
    const domino1 = [1, 13];
    expect(DetermineIfDominoIsSelectable(domino1)).toBe(false);
  });

  it("returns true for a domino when player paths are not set", () => {
    sessionStorage.clear();
    const domino = [6, 7];
    expect(DetermineIfDominoIsSelectable(domino)).toBe(true);
  });
});

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

//getColor (13)
describe("getColor function", () => {
  it('returns "black" for input 0', () => {
    const color = getColor(0);
    expect(color).toBe("black");
  });

  it('returns "#61A7CF" for input 1', () => {
    const color = getColor(1);
    expect(color).toBe("#61A7CF");
  });

  it('returns "#6DD477" for input 2', () => {
    const color = getColor(2);
    expect(color).toBe("#6DD477");
  });

  it('returns "#909090" for input 12', () => {
    const color = getColor(12);
    expect(color).toBe("#909090");
  });

  it('returns "FFFFFFF" for any other input', () => {
    const color = getColor(13);
    expect(color).toBe("FFFFFFF");
  });
});

// convert to react (2)
describe("ConvertToReact function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });
  it("correctly sets selected domino in session storage", () => {
    const dominos = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    const selectedDominoIndex = 1;
    sessionStorage.clear();
    const setSelectedDomino = jest.fn();
    jest.spyOn(React, "useState").mockReturnValue([null, setSelectedDomino]);
    ConvertToReact(dominos, null);

    const expectedDomino = JSON.stringify(dominos[selectedDominoIndex]);
    expect(sessionStorage.getItem("Selected Domino")).toEqual(expectedDomino);
  });
});
