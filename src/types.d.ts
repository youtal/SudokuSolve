type CellProperty = "row" | "column" | "block";
interface Cell {
  row: number;
  column: number;
  block: number;
  value: number;
  index: number;
}
