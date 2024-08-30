import { timeout } from "@reactive/utils/";
// import clc from 'clc';//TODO - sprawdzić, czemu TS tego nie łapie
import clc from 'cli-color';

//deno run ./src/task.ts sync-git

const args = Deno.args;
console.info('args', args);

console.info('czekam sekundę 1');
await timeout(1000);
console.info('czekam sekundę 2');

// const show = async (rrr: Deno.CommandOutput): Promise<void> => {

// };

const execCommand = async (command: string, args: Array<string>): Promise<void> => {
    const out = new Deno.Command(command, {
        args,
    });
    const { code, stdout, stderr } = await out.output();

    console.info('code', code);
    console.info('stdout', new TextDecoder().decode(stdout));
    console.info('stderr', new TextDecoder().decode(stderr));

    if (code !== 0) {
        throw Error('Oczekiwano kodiu odpowiedzi 0');
    }
};

if (args[0] === 'push') {
    // console.info(clc.red('push')); //TODO - sprawdzić, czemu TS tego nie łapie
    console.info(clc.red('push'));
    console.log("%cHello World 1", "color: red");
    console.log("%cHello World 2", "font-weight: bold; font-size: 20px;");
    console.log("%cHello World 3", "color: #FFC0CB");
    console.log("%cHello World 4", "color: rgb(255, 192, 203)");

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
}

if (args[0] === 'sync-git') {

    //katalog z repozytoriami git, sprawdza
}



//TODO - spakowanie zawartości repozytorium git (bez historii i wrzucenie do pliku zip)


//TODO - opcja, poszukiwania zaginionego this-a (albo raczej odczepionego)

//TODO - zablokuj dns-a ???

