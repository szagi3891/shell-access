import { z } from 'zod';
import { autorun, type IReactionDisposer } from "mobx";
import { assertNever } from "@reactive/utils";
import { PidRecordZod } from "../api/processList/processList.ts";
import type { CreateSubscriptionData, SubscriptionRouter } from "./type.ts";


const aaaZod = {
    'process-list': {
        resourceId: z.object({
            type: z.literal('process-list'),
        }),
        resp: z.record(
            z.string(),
            PidRecordZod
        )
    },
    'aaa': {
        resourceId: z.object({
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


type AAA = CreateSubscriptionData<typeof aaaZod>;

//const subscribeTo = 

const startWebsocketApi2 = <T extends SubscriptionRouter>(
    validators: T,
    resourceId: unknown, //subskrybcyjne dane z socketa
    createSubsciption: (data: CreateSubscriptionData<T>) => IReactionDisposer,
): IReactionDisposer => {
    for (const [prefix, { resourceId: resourceIdValidator }] of Object.entries(validators)) {
        const safeData = resourceIdValidator.safeParse(resourceId);

        if (safeData.success) {
            const dispose = createSubsciption({
                type: prefix,
                resourceId: resourceId,
                response: (response) => {

                    //TODO - to wysyłamy do przeglądarki,
                    //trzeba mieć referencję do socketa, oraz id subskrybcji
                    //...
                }
            });

            return dispose;
        }
    }

    throw Error('aaa');
};

startWebsocketApi2(aaaZod, 'ddd', (message) => {

    if (message.type === 'process-list') {

        return autorun(() => {

            //subskrybcja na zewnętrzne źródło danych
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

            return () => {

            };
        });
    }

    if (message.type === 'aaa') {
        return autorun(() => {

            //TODO - subskrybcja na zewnętrzne źródło danych

            message.response([99, 0]);


            return () => {

            };
        });
    }

    return assertNever(message);
});
