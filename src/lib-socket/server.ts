import { autorun, IReactionDisposer } from "mobx";
import { MessageBrowserZod, type MessageBrowserType, type MessageServerType } from "./message.ts";
import { assertNever } from "@reactive/utils";
import { websocketToAsyncQuery } from "./websocketToAsyncQuery.ts";
import type { CreateSubscriptionData, SubscriptionRouter } from "./type.ts";

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

const handleSocketMessage = <SR extends SubscriptionRouter>(
    state: State,
    message: MessageBrowserType,
    subscriptionRouter: SR,
    createSubsciption: (data: CreateSubscriptionData<SR>) => IReactionDisposer,
): void => {
    if (message.type === 'subscribe') {

        const resourceId = message.resource;

        for (const [prefix, { resourceId: resourceIdValidator }] of Object.entries(subscriptionRouter)) {
            const safeData = resourceIdValidator.safeParse(resourceId);
    
            if (safeData.success) {
                const dispose = createSubsciption({
                    type: prefix,
                    resourceId: resourceId,
                    response: (response) => {
                        state.send({
                            type: 'data',
                            id: message.id,
                            data: response
                        });
                    }
                });
    
                // return dispose;
                state.register(message.id, dispose);
                return;
            }
        }

        state.sendError(JSON.stringify({
            message: 'Problem ze zdekodowaniem wiadomości subscribe',
            resource: resourceId,
            id: message.id,
        }));
        return;
    }

    if (message.type === 'unsubscribe') {
        state.unregister(message.id);
        return;
    }

    assertNever(message);
};

export const startWebsocketApi = <SR extends SubscriptionRouter>(
    host: string,
    port: number,
    subscriptionRouter: SR,
    createSubsciption: (data: CreateSubscriptionData<SR>) => IReactionDisposer,

) => {

    Deno.serve({
        hostname: '0.0.0.0',
        port: 9999,
        onListen: () => {
            console.info(`Listening on ws://${host}:${port} ... (3)`);
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

                for await (const message of websocketToAsyncQuery(socket, MessageBrowserZod).subscribe()) {
                    handleSocketMessage(state, message, subscriptionRouter, createSubsciption);
                }

                state.disposeAll();
            })();

            return response;
        }
    });
};

