
export const commandOut = async (command: string, args: Array<string>): Promise<string> => {
    console.info('COMMAND', JSON.stringify([command, ...args], null, 4));

    const out = new Deno.Command(command, {
        args,
    });

    const { code, stdout, stderr } = await out.output();

    if (code !== 0) {
        throw Error('Oczekiwano kodiu odpowiedzi 0');
    }

    const textErr = new TextDecoder().decode(stderr);
    const textOut = new TextDecoder().decode(stdout);

    if (textErr.length > 0) {
        console.log(`%c${textErr}`, 'color: red;');
    }

    return textOut;
};

export const commandExec = async (command: string, args: Array<string>): Promise<void> => {
    const result = await commandOut(command, args);

    if (result.length > 0) {
        console.log(result);
    }
};

