import Sudoku from "./Sudoku";
import verify from "./verify";

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

const pussules_hard = [
    "000600040",
    "000040100",
    "301000000",
    "000030600",
    "000700000",
    "102006930",
    "070008004",
    "000907020",
    "068200700",
];

const pussules_hard2 = [
    "050020000",
    "060004890",
    "010000270",
    "006900030",
    "000000001",
    "980013040",
    "070205460",
    "005601000",
    "000800000",
];

const pussules_expert1 = [
    '005000000',
    '160020040',
    '370000000',
    '000250100',
    '090000000',
    '040700603',
    '000008200',
    '004010009',
    '082900006']

//let sudoku = new Sudoku(pussules_easy);
//sudoku.solve();
//console.log(sudoku.getAnswer());

let sudoku2 = new Sudoku(pussules_expert1);
sudoku2.solve();
console.log(sudoku2.getAnswer());
console.log(verify(sudoku2.getAnswer()));
