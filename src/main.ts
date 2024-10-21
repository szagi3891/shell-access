import { z } from 'zod';
import { PidRecordZod } from "./api/processList/processList.ts";
import { assertNever, AsyncQuery, jsonParse } from "@reactive/utils";


const MessageBrowserZod = z.union([
    z.object({
        type: z.literal('process-list'),
        id: z.number(), //request id 
    }),
    z.object({
        type: z.literal('unsubscribe'),
        id: z.number(), //request id
    }),
]);

type MessageBrowserType = z.TypeOf<typeof MessageBrowserZod>;

const MessageServerZod = z.union([
    z.object({
        type: z.literal('process-list'),
        response: z.record(
            z.string(),
            PidRecordZod
        ),
    }),
    z.string(),
]);

class State {
    //...
}

const handleWs = (socket: WebSocket): AsyncQuery<MessageBrowserType> => {
    const query = new AsyncQuery();

    const timer = setTimeout(() => {
        query.close();
    }, 10_000);

    socket.addEventListener("open", () => {
        console.log("a client connected!");
        clearTimeout(timer);
    });

    socket.addEventListener("message", (event) => {
        if (typeof event.data === 'string') {
            const result = jsonParse(event.data, MessageBrowserZod);

            if (result.type === 'ok') {
                query.push(result.value);
                return;
            }

            if (result.type === 'error') {
                socket.send(JSON.stringify({
                    'type': '',
                    message: result.error
                }));
                query.close();
                return;
            }

            assertNever(result);
        }

        console.info('coś dziwnego dotarło', event.data);
        query.close();
    });

    socket.addEventListener('close', (cv) => {
        console.info('close', cv);
        query.close();
    });

    socket.addEventListener('error', error => {
        console.info('error', error);
        query.close();
    });

    return query;
};

Deno.serve({
    hostname: '127.0.0.1',
    port: 9999,
    onListen: () => {
        console.info('Listening on ws://0.0.0.0:9999 ...');
    },
    handler: (req) => {
        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        (async () => {
            const state = new State();

            for await (const message of handleWs(socket)) {
                //...

                console.info('Wiadomość do obsłużenia', message);
            }

            //czyszczenie subskrybcji
        })();

        return response;
    }
});

/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...

    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska


*/
