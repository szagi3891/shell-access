import { websocketToAsyncQuery } from "./lib/websocketToAsyncQuery.ts";
import { Common } from "./Common.ts";
import { ProcessListModel } from "./models/ProcessListModel.ts";
import { autorun, IReactionDisposer } from "mobx";
import { assertNever } from "@reactive/utils";
import { MessageBrowserZod, type MessageBrowserType, type MessageServerType } from "./message.ts";


class State {
    private readonly subscription: Map<number, IReactionDisposer>;

    constructor(private readonly socket: WebSocket) {
        this.subscription = new Map();
    }

    send(message: MessageServerType) {
        this.socket.send(JSON.stringify(message, null, 4));
    }

    sendError(message: string) {
        this.send({
            type: 'error-message',
            message
        });
    }

    register(id: number, dispose: IReactionDisposer) {
        const oldDispose = this.subscription.get(id);

        if (oldDispose !== undefined) {
            this.sendError(`Zduplikowany id=${id}, starą subskrybcję anuluję`);
            oldDispose();
        }

        this.subscription.set(id, dispose);
    }

    unregister(id: number) {
        const dispose = this.subscription.get(id);
        this.subscription.delete(id);

        if (dispose === undefined) {
            this.sendError(`Nie można odsubskrybować, brakuje id=${id}`);
            return;
        }

        dispose();
    }

    disposeAll() {
        for (const dispose of this.subscription.values()) {
            dispose();
        }
    }
}

const handleSocketMessage = (common: Common, state: State, message: MessageBrowserType): void => {
    if (message.type === 'process-list') {
        const id = message.id;

        const dispose = autorun(() => {
            const data = ProcessListModel.get(common).data;

            if (data.type === 'ready') {
                state.send({
                    type: 'process-list',
                    response: data.value
                });
            }
        });

        state.register(id, dispose);
        return;
    }

    if (message.type === 'unsubscribe') {
        state.unregister(message.id);
        return;
    }

    assertNever(message);
};

const common = new Common();

Deno.serve({
    hostname: '0.0.0.0',
    port: 9999,
    onListen: () => {
        console.info('Listening on ws://0.0.0.0:9999 ... (2)');
    },
    handler: (req) => {
        const isUpgrade = req.headers.get("upgrade") === "websocket";

        console.info(`REQUEST ${req.url} isUpgrade=${isUpgrade}`);

        if (isUpgrade === false) {
            return new Response(
                'Hello world',
                {
                    status: 200
                }
            );
            // return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        (async () => {

            const state = new State(socket);

            for await (const message of websocketToAsyncQuery(socket, MessageBrowserZod)) {
                handleSocketMessage(common, state, message);
            }

            state.disposeAll();
        })();

        return response;
    }
});

/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...

    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska


*/
