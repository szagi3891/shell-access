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



//TODO - spakowanie zawartości repozytorium git (bez historii i wrzucenie do pliku zip)

//TODO - opcja, poszukiwania zaginionego this-a (albo raczej odczepionego)

//TODO - zablokuj dns-a ??? wejście w tryb pracy

