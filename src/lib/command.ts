
export const execCommand = async (command: string, args: Array<string>): Promise<void> => {
    console.info('COMMAND', JSON.stringify([command, ...args], null, 4));

    const out = new Deno.Command(command, {
        args,
    });
    const { code, stdout, stderr } = await out.output();

    const textErr = new TextDecoder().decode(stderr);
    const textOut = new TextDecoder().decode(stdout);

    if (textErr.length > 0) {
        console.log(`%c${textErr}`, 'color: red;');
    }

    if (textOut.length > 0) {
        console.log(textOut);
    }

    if (code !== 0) {
        throw Error('Oczekiwano kodiu odpowiedzi 0');
    }
};
