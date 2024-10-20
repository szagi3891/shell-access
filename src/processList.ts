import { throwError } from "@reactive/utils";
import { commandOut } from "./lib/command.ts";
import { PsOutput } from "./lib/psOutput.ts";

const execPs = async (params: string): Promise<PsOutput> => {
    const list = await commandOut('ps', ['-eo', params]); //args,
    return PsOutput.fromString(list);
}

interface PartialPidRecordType {
    ppid?: string,
    mem?: string,
    cpu?: string,
    args?: string,
    comm?: string,
}

interface PidRecordType {
    ppid: string,
    mem: string,
    cpu: string,
    args: string,
    comm: string,
}

const getOrCreate = (map: Map<string, PartialPidRecordType>, key: string): PartialPidRecordType => {
    const record = map.get(key);

    if (record !== undefined) {
        return record;
    }

    const newRecord = {};
    map.set(key, newRecord);
    return newRecord;
};

export const processList = async (): Promise<Map<string, PidRecordType>> => {
    const [output1, output2, output3] = await Promise.all([
        execPs('pid,ppid,%mem,%cpu'),
        execPs('pid,args'),
        execPs('pid,comm')
    ]);

    const pid = output1.get().getLinesAndTrim();
    const ppid = output1.get().getLinesAndTrim();
    const mem = output1.get().getLinesAndTrim();
    const cpu = output1.getLinesAndTrim();

    const output2Pid = output2.get().getLinesAndTrim();
    const output2Args = output2.getLinesAndTrim();

    const output3Pid = output3.get().getLinesAndTrim();
    const output3Comm = output3.getLinesAndTrim();

    const result: Map<string, PartialPidRecordType> = new Map();

    for (const [index, pidId] of pid.entries()) {
        const resultRecord = getOrCreate(result, pidId);

        resultRecord.ppid = ppid[index] ?? throwError('oczekiwano wartości');
        resultRecord.mem = mem[index] ?? throwError('oczekiwano wartości');
        resultRecord.cpu = cpu[index] ?? throwError('oczekiwano wartości');
    }

    for (const [index, pidId] of output2Pid.entries()) {
        const resultRecord = getOrCreate(result, pidId);

        resultRecord.args = output2Args[index] ?? throwError('oczekiwano wartości');
    }

    for (const [index, pidId] of output3Pid.entries()) {
        const resultRecord = getOrCreate(result, pidId);

        resultRecord.comm = output3Comm[index] ?? throwError('oczekiwano wartości');
    }
    
    const resultOut: Map<string, PidRecordType> = new Map();

    for (const [key, value] of result) {
        if (value.ppid !== undefined && value.mem !== undefined && value.cpu !== undefined && value.args !== undefined && value.comm !== undefined) {
            const record: PidRecordType= {
                ppid: value.ppid,
                mem: value.mem,
                cpu: value.cpu,
                args: value.args,
                comm: value.comm,
            };

            resultOut.set(key, record);
        } else {
            console.error('Niekompletny rekord', value);
        }
    }

    return resultOut;
};
