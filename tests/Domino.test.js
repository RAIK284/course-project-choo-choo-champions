import React from "react";
import { render } from "@testing-library/react";
import Domino from "../src/components/Domino";
import { ConvertToReact } from "../src/components/Domino";
import { screen } from "@testing-library/react";

describe("Domino Component", () => {
  it("renders without crashing", () => {
    render(<Domino />);
  });
});

describe("ConvertToReact Function", () => {
  test("renders a list of dominoes correctly", () => {
    const dominoes = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    render(ConvertToReact(dominoes));
    const dominoTopImages = screen.getByAltText(
      "Top dots representing a number"
    );
    expect(dominoTopImages).toHaveLength(dominoes.length * 1);
  });
});
