export default (ans: number[][]): boolean => {
  const ans2arr = ans.flat();
  for (let i = 0; i < 9; ++i) {
    if (!verifyByProperty(ans2arr, "row", i)) return false;
    if (!verifyByProperty(ans2arr, "column", i)) return false;
    if (!verifyByProperty(ans2arr, "block", i)) return false;
  }
  return true;
};
const verifyByProperty = (
  ans: number[],
  property: CellProperty,
  verifyIndex: number
): boolean => {
  let indexToVerify: number[] = new Array(9).fill(0);
  if (property === "row") {
    indexToVerify = indexToVerify.map((_, i) => i + verifyIndex * 9);
  } else if (property === "column") {
    indexToVerify = indexToVerify.map((_, i) => i * 9 + verifyIndex);
  } else if (property === "block") {
    const row = Math.floor(verifyIndex / 3) * 3;
    const column = (verifyIndex % 3) * 3;
    indexToVerify = indexToVerify.map((_, i) => {
      const rowOffset = Math.floor(i / 3);
      const columnOffset = i % 3;
      return (row + rowOffset) * 9 + column + columnOffset;
    });
  }
  //console.log(indexToVerify);

  let mask = 0;
  indexToVerify.forEach((index) => {
    mask |= 1 << (ans[index] - 1);
  });
  return mask === 0x1ff;
};
