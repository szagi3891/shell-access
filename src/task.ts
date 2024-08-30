import { timeout } from "@reactive/utils/";
import { execCommand } from "./lib/command.ts";
import { taskPush } from "./task/push.ts";
// import clc from 'clc';//TODO - sprawdzić, czemu TS tego nie łapie
// import clc from 'cli-color';
// "clc": "npm:clc@^1.0.2",
// "cli-color": "npm:cli-color@^2.0.4"

//deno run ./src/task.ts sync-git

const args = Deno.args;
console.info('args', args);

console.info('czekam sekundę 1');
await timeout(1000);
console.info('czekam sekundę 2');

if (args[0] === 'push') {
    await taskPush();
}

if (args[0] === 'sync-git') {

    //katalog z repozytoriami git, sprawdza
}


//TODO - spakowanie zawartości repozytorium git (bez historii i wrzucenie do pliku zip)

//TODO - opcja, poszukiwania zaginionego this-a (albo raczej odczepionego)

//TODO - zablokuj dns-a ??? wejście w tryb pracy

