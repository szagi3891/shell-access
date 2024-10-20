import { z } from 'zod';
import { PidRecordZod } from "./api/processList/processList.ts";


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

        const state = new State();

        socket.addEventListener("open", () => {
            console.log("a client connected!");
        });

        socket.addEventListener("message", (event) => {
            if (event.data === "ping") {
                socket.send("pong");
                return;
            }

            console.info('coś dziwnego dotarło', event.data);
        });

        socket.addEventListener('close', (cv) => {
            console.info('close', cv);
        });

        socket.addEventListener('error', error => {
            console.info('error', error);
        });

        return response;
    }
});

/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...

    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska


*/
