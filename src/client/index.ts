import { timeout } from '@reactive/utils';


const main = async () => {
    console.info('hello');
    await timeout(1000);
    console.info('world');
};

await main();