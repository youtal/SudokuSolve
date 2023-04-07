import Sudoku from "../src/Sudoku";
import verify from "../src/verify";

const pussules_esay = [
  [
    "002080060",
    "056917030",
    "040050871",
    "090000600",
    "671095200",
    "000020100",
    "167030590",
    "480070300",
    "025460000",
  ],
];

describe("solve", () => {
  test("solve", () => {
    pussules_esay.forEach((pussule) => {
      let sudoku = new Sudoku(pussule);
      sudoku.solve();
      expect(verify(sudoku.getAnswer())).toBe(true);
    });
  });
});
