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
  [
    "000600040",
    "000040100",
    "301000000",
    "000030600",
    "000700000",
    "102006930",
    "070008004",
    "000907020",
    "068200700",
  ],
  [
    "050020000",
    "060004890",
    "010000270",
    "006900030",
    "000000001",
    "980013040",
    "070205460",
    "005601000",
    "000800000",
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
