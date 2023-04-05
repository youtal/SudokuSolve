import * as _ from "lodash";
type CellProperty = "row" | "column" | "block";
interface Cell {
  row: number;
  column: number;
  block: number;
  value: number;
  index: number;
}

const init = (pussule: number[][], solvedCells: Set<number>): Cell[] => {
  //检查pusule大小是否合法
  if (pussule.length !== 9 || pussule.some((row) => row.length !== 9)) {
    console.log("pussule size is not 9x9");
    return [];
  }

  const cells: Cell[] = [];
  pussule.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const block = Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3);
      cells.push({
        row: rowIndex,
        column: columnIndex,
        block,
        value: value === 0 ? 0x1ff : 1 << (value - 1),
        //此处cells未push，所以index为cells.length
        index: cells.length,
      });

      //将已知值对应cell同时更新到solvedCells
      if (value !== 0) {
        solvedCells.add(cells.length - 1);
      }
    });
  });
  //console.log(solvedCells);
  return cells;
};

const operateByCellProperty = (
  cell: Cell,
  cells: Cell[],
  property: CellProperty,
  changedCells: Cell[]
) => {
  if (Math.log2(cell.value) % 1 !== 0) {
    console.log(
      `cell value : ${cell.value.toString(
        2
      )} is not a power of 2, cell index: ${cell.index},
        cell coordinate: (${cell.row}, ${cell.column}), property: ${property},
        }`
    );
    return;
  }
  const targetCells = cells.filter(
    (c) => c[property] === cell[property] && c !== cell
  );
  targetCells.forEach((targetCell) => {
    targetCell.value &= cell.value ^ 0x1ff;
    changedCells.push(targetCell);
  });
};

const checkByCellProperty = (
  cell: Cell,
  cells: Cell[],
  property: CellProperty,
  solved: number[][],
  solvedCells: Set<number>
) => {
  const masks = cells
    .filter((c) => c[property] === cell[property] && c !== cell)
    .map((c) => c.value);
  let mask = masks.reduce((a, b) => a | b) ^ 0x1ff;
  let compared = cell.value & mask;
  if (Math.log2(compared) % 1 == 0) {
    solved[cell.row][cell.column] = Math.log2(compared) + 1;
    cell.value = compared;
    if (!solvedCells.has(cell.index)) {
      solvedCells.add(cell.index);
    }
    return true;
  }
  return false;
};

const checkCell = (
  cell: Cell,
  cells: Cell[],
  solved: number[][],
  solvedCells: Set<number>
) => {
  const log2Value = Math.log2(cell.value);
  if (Number.isInteger(log2Value)) {
    solved[cell.row][cell.column] = log2Value + 1;
    if (!solvedCells.has(cell.index)) {
      solvedCells.add(cell.index);
    }
    return true;
  }
  const properties: CellProperty[] = ["row", "column", "block"];
  for (const property of properties) {
    if (checkByCellProperty(cell, cells, property, solved, solvedCells))
      return true;
  }
  return false;
};

const solve = (
  pussule_str: string[]
): { ans: number[][]; solved: boolean; round: number } | null => {
  let pussule = pussule_str.map((row) => row.split("").map((c) => parseInt(c)));
  let solved = _.cloneDeep(pussule);
  let changedCells: Cell[] = [];
  let solvedCells: Set<number> = new Set();
  let operatedSolvedCells: Set<number> = new Set();
  const cells = init(pussule, solvedCells);
  if (cells.length === 0) {
    console.log("pussule size is not 9x9");
    return null;
  }

  let operated = 0;
  let round = 0;
  while (operated < solvedCells.size) {
    solvedCells.forEach((index) => {
      if (operatedSolvedCells.has(index)) return;
      const cell = cells[index];
      const properties: CellProperty[] = ["row", "column", "block"];
      for (const property of properties) {
        operateByCellProperty(cell, cells, property, changedCells);
      }
      operatedSolvedCells.add(index);
    });
    operated = solvedCells.size;
    changedCells.forEach((cell) => {
      checkCell(cell, cells, solved, solvedCells);
    });
    ++round;
  }
  let solvedCount = solvedCells.size;
  return { ans: solved, solved: solvedCount === 81, round };
};

export default solve;
