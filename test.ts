const timeout = (timeoutMs: number): Promise<void> => {
    const result = Promise.withResolvers<void>();
    setTimeout(result.resolve, timeoutMs);
    return result.promise;
};

const main = async (): Promise<void> => {
    console.info('Test ...');

    for (let i = 0; i < 10; i++) {
        console.info(`I=${i}`);
        await timeout(1000);
    }

    console.info('Koniec testu');
};
