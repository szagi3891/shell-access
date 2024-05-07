const timeout = (timeoutMs: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeoutMs);
    });
    // const result = Promise.withResolvers<void>();
    // setTimeout(() => result.resolve(), timeoutMs);
    // return result.promise;
};

const main = async (): Promise<void> => {
    console.info('Test ...');

    for (let i = 0; i < 10; i++) {
        console.info(`I=${i}`);
        await timeout(1000);
    }

    console.info('Koniec testu');
};

main()
    .then(() => {
        console.info('gotowe ...');
    })
    .catch((error) => {
        console.error('error', error);
    });

/*

npx github:piuccio/cowsay JavaScript FTW!
https://dev.to/ipreda/run-your-npx-script-directly-from-github-create-your-own-cli-commands-and-other-stories-4pn3
https://github.com/piuccio/cowsay

*/
