import Sudoku from "./Sudoku";

const pussules_easy = [
  "002080060",
  "056917030",
  "040050871",
  "090000600",
  "671095200",
  "000020100",
  "167030590",
  "480070300",
  "025460000",
];

let sudoku = new Sudoku(pussules_easy);
sudoku.solve();
console.log(sudoku.getAnswer());
