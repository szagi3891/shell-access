import { expect } from "jsr:@std/expect";
import { PsOutput } from "./psOutput.ts";

Deno.test('PsOutput.skipFirstChar', () => {
    const data = [
        '',
        '  PID ARGS                                                               PID COMM',
        '    1 /sbin/launchd                                                        1 /sbin/launchd',
        '   85 /usr/libexec/logd                                                   85 /usr/libexec/logd',
        '   86 /usr/libexec/smd                                                    86 /usr/libexec/smd',
        '   87 /usr/libexec/UserEventAgent (System)                                87 /usr/libexec/UserEventAgent',
        ''
    ].join('\n');
    const output = PsOutput.fromString(data);

    expect(output.getLines().length).toBe(5);

    expect(output.getLines()).toEqual([
        'PID ARGS                                                               PID COMM                       ',
        '  1 /sbin/launchd                                                        1 /sbin/launchd              ',
        ' 85 /usr/libexec/logd                                                   85 /usr/libexec/logd          ',
        ' 86 /usr/libexec/smd                                                    86 /usr/libexec/smd           ',
        ' 87 /usr/libexec/UserEventAgent (System)                                87 /usr/libexec/UserEventAgent',
    ]);
});

Deno.test('psOutput', () => {

    const data = [
        '',
        '  PID ARGS                                                               PID COMM',
        '    1 /sbin/launchd                                                        1 /sbin/launchd',
        '   85 /usr/libexec/logd                                                   85 /usr/libexec/logd',
        '   86 /usr/libexec/smd                                                    86 /usr/libexec/smd',
        '   87 /usr/libexec/UserEventAgent_(System)                                87 /usr/libexec/UserEventAgent',
        ''
    ].join('\n');

    const output = PsOutput.fromString(data);

    expect(output.getLines().length).toBe(5);

    const column1 = output.get();

    expect(column1.getLinesAndTrim()).toEqual([
        'PID',
        '1',
        '85',
        '86',
        '87'
    ]);

    expect(output.getLinesAndTrim()).toEqual([
        'ARGS                                                               PID COMM',
        '/sbin/launchd                                                        1 /sbin/launchd',
        '/usr/libexec/logd                                                   85 /usr/libexec/logd',
        '/usr/libexec/smd                                                    86 /usr/libexec/smd',
        '/usr/libexec/UserEventAgent_(System)                                87 /usr/libexec/UserEventAgent'
    ]);

    const column3 = output.get();

    expect(column3.getLinesAndTrim()).toEqual([
        'ARGS',
        '/sbin/launchd',
        '/usr/libexec/logd',
        '/usr/libexec/smd',
        '/usr/libexec/UserEventAgent_(System)'
    ]);

    expect(output.getLinesAndTrim()).toEqual([
        'PID COMM',
        '1 /sbin/launchd',
        '85 /usr/libexec/logd',
        '86 /usr/libexec/smd',
        '87 /usr/libexec/UserEventAgent'
    ]);

    const column5 = output.get();

    expect(column5.getLinesAndTrim()).toEqual([
        'PID',
        '1',
        '85',
        '86',
        '87'
    ]);

    expect(output.getLinesAndTrim()).toEqual([
        'COMM',
        '/sbin/launchd',
        '/usr/libexec/logd',
        '/usr/libexec/smd',
        '/usr/libexec/UserEventAgent'
    ]);
})