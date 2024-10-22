import { startWebsocketApi } from "./lib-socket/server.ts";
import { PidRecordZod } from "./api/processList/processList.ts";
import { z } from 'zod';
import { autorun, type IReactionDisposer } from "mobx";
import { assertNever } from "@reactive/utils";

const DataIdZod = z.object({
    type: z.literal('process-list'),
});

type DataIdType = z.TypeOf<typeof DataIdZod>;

const DataResponseZod = z.object({
    response: z.record(
        z.string(),
        PidRecordZod
    ),
});

const aaaZod = {
    'process-list': {
        req: z.object({
            type: z.literal('process-list'),
        }),
        resp: z.record(
            z.string(),
            PidRecordZod
        )
    },
    'aaa': {
        req: z.object({
            type: z.literal('aaa'),
        }),
        resp: z.array(z.number()),
    }
};

//z.ZodType<T>

/*
type RouterState<T extends Record<string, { req: z.ZodType<unknown>, resp: z.ZodType<unknown>}>> = {
    [K in keyof T]: {
        route: K;
        params: T[K] extends Route<infer P> ? P : never;
    }
}[keyof T];
*/

type CreateSubscription<T extends Record<string, { req: z.ZodType<unknown>, resp: z.ZodType<unknown>}>> = {
    [K in keyof T]: {
        type: K;
        params: z.infer<T[K]['req']>;
        response: (response: T[K]['resp'] extends z.ZodType<infer P> ? P : never) => void;
    }
}[keyof T];

type AAA = CreateSubscription<typeof aaaZod>;

const startWebsocketApi2 = <T extends Record<string, { req: z.ZodType<unknown>, resp: z.ZodType<unknown>}>>(
    validators: T,
    // data: unknown,
    createSubsciption: (data: CreateSubscription<T>) => IReactionDisposer,
): IReactionDisposer => {
    //...

    //dane które przychodzą z socketa

    const data = 3;

    for (const [prefix, { req, resp }] of Object.entries(validators)) {
        // const 

        const safeData = req.safeParse(data);

        if (safeData.success) {
            const dispose = createSubsciption({
                type: prefix,
                params: data,
                response: (response) => {

                    //TODO - to wysyłamy do przeglądarki,
                }
            });

            return dispose;
        }
    }

    throw Error('aaa');
};

startWebsocketApi2(aaaZod, (message) => {

    if (message.type === 'process-list') {
        // message.params
        // message.response('aa');
        message.response({
            'a': {
                'ppid': '',
                'mem': 'd',
                'cpu': '',
                'args': ''
            }
        });
        return autorun(() => {});
    }

    if (message.type === 'aaa') {
        message.response([99, 0]);
        return autorun(() => {});
    }

    return assertNever(message);
});

/*
    deklaracja typów "API" socketowego

    {
        process-list: {
            req: ZodType<...>,
            resp: ZodType<...>,
        },
        ...
    }
*/



// const common = new Common();

/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...
    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska
*/

startWebsocketApi('0.0.0.0', 9999, DataIdZod, (subscribeMessage: DataIdType,) => {

    //TODO

    const dispose = autorun(() => {
        //TODO
    });

    return dispose;

    // if (message.type === 'process-list') {
    //     const id = message.id;

    //     const dispose = autorun(() => {
    //         const data = ProcessListModel.get(common).data;

    //         if (data.type === 'ready') {
    //             state.send({
    //                 type: 'process-list',
    //                 response: data.value
    //             });
    //         }
    //     });

    //     state.register(id, dispose);
    //     return;
});

