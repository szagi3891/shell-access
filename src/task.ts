import { taskPush } from "./task/push.ts";
import { syncAllProjectGit } from "./task/syncAllProjectGit.ts";

const args = Deno.args;
console.info('args', args);

const map: Record<string, () => Promise<void>> = {
    'push': taskPush,
    'sync-all-project-git': syncAllProjectGit,
};

// const [command, ...commandArg] = args;
const command = Deno.args[0] ?? '';

const task = map[command];

if (task === undefined) {
    console.info(`%cNie zdefiniowano taska o nazwie: "${command}"`, 'color: red; font-weight: bold');
    Deno.exit(1);
}

task();
/*

https://raw.githubusercontent.com/szagi3891/shell-access/refs/heads/main/src/client/index.html
https://raw.githubusercontent.com/szagi3891/shell-access/refs/heads/main/deno.json

rm -Rf ./dist && deno run -A https://deno.land/x/packup@v0.2.6/cli.ts build --import-map=./deno.json ./src/client/index.html --dist-dir=./dist

rm -Rf ./dist && deno run -A https://deno.land/x/packup@v0.2.6/cli.ts build --import-map=https://raw.githubusercontent.com/szagi3891/shell-access/refs/heads/main/deno.json https://raw.githubusercontent.com/szagi3891/shell-access/refs/heads/main/src/client/index.html --dist-dir=./dist

*/

/*
    trzeba odpalć proces bundlowania

    trzeba wystartować serwer
*/


//TODO - spakowanie zawartości repozytorium git (bez historii i wrzucenie do pliku zip)

//TODO - opcja, poszukiwania zaginionego this-a (albo raczej odczepionego)

//TODO - zablokuj dns-a ??? wejście w tryb pracy

