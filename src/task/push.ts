import { execCommand } from "../lib/command.ts";

export const taskPush = async (): Promise<void> => {

    // console.info(clc.red('push')); //TODO - sprawdzić, czemu TS tego nie łapie
    // console.info(clc.red('push'));
    // console.log("%cHello World 1", "color: red");
    // console.log("%cHello World 2", "font-weight: bold; font-size: 20px;");
    // console.log("%cHello World 3", "color: #FFC0CB");
    // console.log("%cHello World 4", "color: rgb(255, 192, 203)");

    await execCommand('git', ['add', '.']);
    await execCommand('git', ['commit', '-am', 'auto save']);
    await execCommand('git', ['push', 'origin']);

    // await execCommand('echo', ['aaaa', 'bbbb']);
    // await execCommand('git', ['branch']);

    // const rrr = await (new Deno.Command('git', {
    //     args: [ 'branch' ]
    // })).output();

    // const command = new Deno.Command(Deno.execPath(), {
    //     args: [
    //       "eval",
    //       "console.log('hello'); console.error('world')",
    //     ],
    //   });
    // const { code, stdout, stderr } = command.outputSync();

    // const p = Deno.run({ cmd: ["echo", "abcd"] });

    //przeczytaj jaki jest branch
    //zrób komit
    //wypchnij na zdalne repo


    //commit, wypchnij
    //return;
    console.info('wypchnięte');
};

