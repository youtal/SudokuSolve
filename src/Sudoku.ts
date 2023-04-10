import * as _ from "lodash";

enum property {
    row,
    column,
    block,
}

class Sudoku {
    answer: number[][];
    //每个数字使用27位二进制数表示，前9位代表行，中间9位代表列，后9位代表块
    //数组长度为9，每个前9位记录第i行可用的数字，中间9位记录第i列可用的数字，后9位记录第i块可用的数字
    valueCandidateSymbol: number[];

    constructor(puzzle_str: String[]) {
        //初始化valueCandidateSymbol,将每个数字的前27置为1
        this.valueCandidateSymbol = new Array(9).fill(0x7ffffff);
        //this.valueCandidateSymbol.forEach(s=>console.log(s.toString(2)));
        this.answer = puzzle_str.map((row) => {
            return row.split("").map((value) => {
                return parseInt(value);
            });
        });
        //遍历每个数字，将其对应的行、列、块的可用数字置为0
        this.answer.forEach((row, rowIndex) => {
            row.forEach((value, columnIndex) => {
                if (value !== 0) {
                    this.excludeValue(rowIndex, columnIndex, value);
                }
            });
        });
        //this.valueCandidateSymbol.forEach((s) => console.log(s.toString(2)));
    }

    private getBlockIndex(row: number, column: number): number {
        return Math.floor(row / 3) * 3 + Math.floor(column / 3);
    }

    private index2Coordinate(index: number): Coordinate {
        return {
            row: Math.floor(index / 9),
            column: index % 9,
            block: this.getBlockIndex(Math.floor(index / 9), index % 9),
        };
    }

    //排除某个数字在某个行、列、块中的可能性
    private excludeValue(row: number, column: number, value: number): void {
        //检查输入
        if (
            row < 0 ||
            row > 8 ||
            column < 0 ||
            column > 8 ||
            value < 1 ||
            value > 9 ||
            !Number.isInteger(row) ||
            !Number.isInteger(column) ||
            !Number.isInteger(value)
        ) {
            throw new Error(
                `invalid input: row=${row}, column=${column}, value=${value}`
            );
        }
        this.valueCandidateSymbol[row] &=
            (1 << (value - 1 + property.row * 9)) ^ 0x7ffffff;
        this.valueCandidateSymbol[column] &=
            (1 << (value - 1 + property.column * 9)) ^ 0x7ffffff;
        this.valueCandidateSymbol[this.getBlockIndex(row, column)] &=
            (1 << (value - 1 + property.block * 9)) ^ 0x7ffffff;
    }

    //获取对应位置的待选标志
    private getAvailableSymbol(row: number, column: number): number {
        return (
            0x1ff &
            (this.valueCandidateSymbol[row] >> (property.row * 9)) &
            (this.valueCandidateSymbol[column] >> (property.column * 9)) &
            (this.valueCandidateSymbol[this.getBlockIndex(row, column)] >>
                (property.block * 9))
        );
    }

    //不适用回溯，简单解算出可解算的数字，减少回溯规模
    private simpleSolve(): void {
        let [lastCheck, currentCheck] = [0, 0];
        do {
            const {row, column} = this.index2Coordinate(currentCheck);
            //如果当前位置已经有数字，跳过
            if (this.answer[row][column] !== 0) {
                currentCheck++;
                currentCheck %= 80;
                continue;
            }
            //获取当前位置的待选标志
            const availableSymbol = this.getAvailableSymbol(row, column);
            //如果只有一个可选数字，填入,并排除该数字在该行、列、块中的可能性
            if (!(availableSymbol & (availableSymbol - 1))) {
                const value = Math.log2(availableSymbol) + 1;
                this.answer[row][column] = value;
                this.excludeValue(row, column, value);
                //更新lastCheck
                lastCheck = currentCheck;
            }
            currentCheck++;
            currentCheck %= 80;
        } while (
            //lastCheck等于currentCheck遍历完所有位置均无新的解算位置更新
        lastCheck !== currentCheck
            );
    }

    private backtrackingSolve(start: number): boolean {
        //如果遍历完所有位置，返回true
        if (start === 81) return true;
        const {row, column} = this.index2Coordinate(start);
        if (this.answer[row][column] !== 0) return this.backtrackingSolve(start + 1);
        let availableSymbol = this.getAvailableSymbol(row, column);
        //如果没有可选数字，回溯
        if (availableSymbol === 0) return false;
        //记录当前状态，回溯时恢复
        const [answerBk, valueCandidateSymbolBk] = [_.cloneDeep(this.answer), _.cloneDeep(this.valueCandidateSymbol)];
        while (availableSymbol !== 0) {
            const curCandidateSymbol = availableSymbol & (-availableSymbol);
            const value = Math.log2(curCandidateSymbol) + 1;
            this.answer[row][column] = value;
            this.excludeValue(row, column, value);
            if (this.backtrackingSolve(start + 1)) return true;
            //回溯
            this.answer = _.cloneDeep(answerBk);
            this.valueCandidateSymbol = _.cloneDeep(valueCandidateSymbolBk);
            availableSymbol &= availableSymbol - 1;
        }
        return false;
    }

    public solve(): boolean {
        this.simpleSolve();
        //使用valueCandidateSymbol进行验证，如果结算完毕，valueCandidateSymbol中每个数字均为0
        if (this.valueCandidateSymbol.every((value) => value === 0)) return true;
        //调用回溯算法
        return this.backtrackingSolve(0);
    }

    public getAnswer(): number[][] {
        return this.answer;
    }
}

export default Sudoku;
