import * as _ from "lodash";

class Sudoku {
  answer: number[][];
  cells: Cell[];
  solvedCells: Set<number>;
  changedCells: Set<Cell>;
  constructor(puzzle_str: string[]) {
    //将puzzle转换为number[][]
    const puzzle = puzzle_str.map((row) =>
      row.split("").map((value) => parseInt(value))
    );

    //检查输入是否合法
    if (puzzle.length !== 9 || puzzle.some((row) => row.length !== 9)) {
      throw new Error("Invalid input");
    }

    //初始化
    this.answer = _.cloneDeep(puzzle);
    this.cells = [];
    this.solvedCells = new Set();
    this.changedCells = new Set();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        //无论该位置是否有数字，都将其初始化，将未知数字的value设为0x1ff
        this.cells.push({
          row: i,
          column: j,
          block: Math.floor(i / 3) * 3 + Math.floor(j / 3),
          value: this.answer[i][j] === 0 ? 0x1ff : 1 << (this.answer[i][j] - 1),
          index: i * 9 + j,
        });
        //将已知数字的index加入solvedCells
        if (this.answer[i][j] !== 0) {
          this.solvedCells.add(i * 9 + j);
        }
      }
    }
  }

  private operateByCellProperty(
    cell: Cell,
    property: CellProperty,
    checkFollowingCellsOnly: boolean = false
  ) {
    //检查该cell是否具有唯一值，不具备则报错
    const log2Value = Math.log2(cell.value);
    if (!Number.isInteger(log2Value)) {
      throw new Error(`Cell ${cell.index} has no unique value: ${cell.value}`);
    }

    //按照property类型，操作该cell的同一行、同一列或同一宫格内的其他cell，若checkFollowingCellsOnly为true，则只操作该cell的后续cell
    const cells = this.cells.filter(
      (c) =>
        c[property] === cell[property] &&
        c.index !== cell.index &&
        !this.solvedCells.has(c.index) &&
        (checkFollowingCellsOnly ? c.index > cell.index : true)
    );
    for (const targetCell of cells) {
      targetCell.value &= cell.value ^ 0x1ff;
      this.changedCells.add(targetCell);
    }
  }

  private operateCell(cell: Cell, checkFollowingCellsOnly: boolean = false) {
    this.operateByCellProperty(cell, "row", checkFollowingCellsOnly);
    this.operateByCellProperty(cell, "column", checkFollowingCellsOnly);
    this.operateByCellProperty(cell, "block", checkFollowingCellsOnly);
  }

  private checkCellByProperty(cell: Cell, property: CellProperty): boolean {
    const masks = this.cells
      .filter((c) => c[property] === cell[property] && c !== cell)
      .map((c) => c.value);
    const mask = masks.reduce((a, b) => a | b) ^ 0x1ff;
    //const mask = masks.reduce((a, b) => a & b, 0x1ff);
    const compared = cell.value & mask;
    const log2Compared = Math.log2(compared);
    if (Number.isInteger(log2Compared)) {
      this.answer[cell.row][cell.column] = log2Compared + 1;
      cell.value = compared;
      this.solvedCells.add(cell.index);
      //TODO:直接operate当前cell
      this.operateCell(cell);
      return true;
    }
    return false;
  }

  private checkCell(cell: Cell): boolean {
    const log2Value = Math.log2(cell.value);
    if (Number.isInteger(log2Value)) {
      this.answer[cell.row][cell.column] = log2Value + 1;
      this.solvedCells.add(cell.index);
      this.operateCell(cell);
      return true;
    }
    return (
      this.checkCellByProperty(cell, "row") ||
      this.checkCellByProperty(cell, "column") ||
      this.checkCellByProperty(cell, "block")
    );
  }

  private simplifyChangedCells(): void {}

  public solve(): boolean {
    //首轮检查
    this.solvedCells.forEach((index) => this.operateCell(this.cells[index]));

    //while循环，直到changedCells为空
    while (this.changedCells.size > 0) {
      //取出changedCells中的第一个cell并移除
      const cell = this.changedCells.values().next().value;
      this.changedCells.delete(cell);
      this.checkCell(cell);
    }

    return true;
  }

  public getAnswer(): number[][] {
    return this.answer;
  }
}

export default Sudoku;
