import { throwError } from '@reactive/utils';

const countStringLengths = (strings: string[]): Record<number, number> => {
    const lengthCount: Record<number, number> = {};

    for (const str of strings) {
        const length = str.length;

        if (lengthCount[length] !== undefined) {
            lengthCount[length]++;
        } else {
            lengthCount[length] = 1;
        }
    }

    return lengthCount;
};

export class PsOutput {

    private constructor(private lines: Array<string>) {
        const histogram = countStringLengths(lines);
        if (Object.values(histogram).length !== 1) {
            throw Error('Oczekiwano że każdy z wierszy będzie takiej samej długości');
        }
    }

    public static fromLines(lines: Array<string>): PsOutput {
        const newPsOutput = new PsOutput(lines);

        if (newPsOutput.isColumnWithSpaces(0)) {
            return newPsOutput.skipFirstChar();
        }

        return newPsOutput;
    }

    public static fromString(output: string): PsOutput {
        for (const char of output) {
            if (char === '\t') {
                throw Error('Wykryto tabulację - nieprawidłowe odgałęzienie');
            }
        }

        const lines = output
            .split('\n')
            .filter(line => {
                if (line.trim().length === 0) {
                    return false;
                }

                return true;
            });
        
        const max = Math.max(...lines.map(line => line.length));

        const newLines = lines.map(line => {
            return line.padEnd(max, ' ')
        });

        const newPsOutput = new PsOutput(newLines);

        if (newPsOutput.isColumnWithSpaces(0)) {
            return newPsOutput.skipFirstChar();
        }

        return newPsOutput;
    }

    skipFirstChar(): PsOutput {
        const lines: Array<string> = [];

        for (const line of this.lines) {
            lines.push(line.substring(1));
        }

        return PsOutput.fromLines(lines);
    }

    isColumnWithSpaces(index: number): boolean {
        for (const line of this.lines) {
            if (line[index] !== ' ') {
                return false;
            }
        }

        return true;
    }

    findIndex(): number {
        const first = this.lines[0] ?? throwError('oczekiwano przynajmniej jednej linii');
        
        for (let index = 0; index < first.length; index++) {
            if (this.isColumnWithSpaces(index)) {
                return index;
            }
        }

        throw Error('Nie znaleziono indexu');
    }

    get(): PsOutput {
        const columnIndex = this.findIndex();
    
        const firstResult: Array<string> = [];
        const secondResult: Array<string> = [];

        for (const line of this.lines) {
            const firstPart = line.substring(0, columnIndex);
            const secondPart = line.substring(columnIndex + 1);

            firstResult.push(firstPart);
            secondResult.push(secondPart);
        }

        const result = PsOutput.fromLines(firstResult);

        this.lines = PsOutput.fromLines(secondResult).lines;

        return result;
    }

    getLines(): Array<string> {
        return this.lines;
    }

    getLinesAndTrim(): Array<string> {
        return this.lines.map(line => line.trim());
    }
}

