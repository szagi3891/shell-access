import { timeout } from "@reactive/utils/";

//deno run ./src/task.ts sync-git

const args = Deno.args;
console.info('args', args);

console.info('czekam sekundę 1');
await timeout(1000);
console.info('czekam sekundę 2');


if (args[0] === 'push') {
    console.info('push');

    //commit, wypchnij
    //return;
}

if (args[0] === 'sync-git') {

}