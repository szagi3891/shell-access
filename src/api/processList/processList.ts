import { throwError } from "@reactive/utils";
import { commandOut } from "../../lib/command.ts";
import { PsOutput } from "./psOutput.ts";
import { z } from 'zod';

const execPs = async (params: string): Promise<PsOutput> => {
    const list = await commandOut('ps', ['-eo', params]); //args,
    return PsOutput.fromString(list);
}

interface PartialPidRecordTypeV1 {
    ppid?: string,
    mem?: string,
    cpu?: string,
    args?: string,
    comm?: string,
}

interface PidRecordTypeV1 {
    ppid: string,
    mem: string,
    cpu: string,
    args: string,
    comm: string,
}

const getOrCreate = (map: Record<string, PartialPidRecordTypeV1>, key: string): PartialPidRecordTypeV1 => {
    const record = map[key];

    if (record !== undefined) {
        return record;
    }

    const newRecord = {};
    map[key] = newRecord;
    return newRecord;
};

export const PidRecordZod = z.object({
    ppid: z.string(),
    mem: z.string(),
    cpu: z.string(),
    args: z.string(),
});

export type PidRecordType = z.TypeOf<typeof PidRecordZod>;
// interface PidRecordType {
//     ppid: string,
//     mem: string,
//     cpu: string,
//     args: string,
// }

export const processList = async (): Promise<Record<string, PidRecordType>> => {
    const output = await execPs('pid,ppid,%mem,%cpu,args');

    const pid = output.get().getLinesAndTrim();
    const ppid = output.get().getLinesAndTrim();
    const mem = output.get().getLinesAndTrim();
    const cpu = output.getLinesAndTrim();
    const args = output.getLinesAndTrim();

    const result: Record<string, PidRecordType> = {};

    for (const [index, pidId] of pid.entries()) {
        const resultRecord = getOrCreate(result, pidId);

        resultRecord.ppid = ppid[index] ?? throwError('oczekiwano wartości');
        resultRecord.mem = mem[index] ?? throwError('oczekiwano wartości');
        resultRecord.cpu = cpu[index] ?? throwError('oczekiwano wartości');
        resultRecord.args = args[index] ?? throwError('oczekiwano wartości');
    }

    return result;
};
