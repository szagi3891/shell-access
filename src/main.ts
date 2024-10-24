import { startWebsocketApi } from "./lib-socket/server.ts";
import { PidRecordZod } from "./api/processList/processList.ts";
import { z } from 'zod';
import { autorun } from "mobx";
import { assertNever, Value } from "@reactive/utils";
import { ProcessListModel } from "./models/ProcessListModel.ts";
import { Common } from "./Common.ts";

const SocketRouterZod = {
    'process-list': {
        resourceId: z.object({
            type: z.literal('process-list'),
        }),
        resp: z.record(
            z.string(),
            PidRecordZod
        )
    },
    'current-time': {
        resourceId: z.object({
            type: z.literal('current-time'),
        }),
        resp: z.string(),
    },
    'user-data': {
        resourceId: z.object({
            type: z.literal('user-data'),
            id: z.number(),
        }),
        resp: z.string(),
    }
};

//TODO - zasób, który będzie zwracał informację na temat wszystkich tasków
/*
    zasób1, zasób2, zasób3
    jak zasób1 wystartuje, to można wystartować zasób2
    jak dwójak wystartuje to wtedy dopiero można będzie wystartować zasób 3
*/

/*

    {
        "type": "subscribe",
        "id": 3,
        "resource": {
            "type": "process-list"
        }
    }

    {
        "type": "unsubscribe",
        "id": 3
    }


    //inne podejście
    {
        "type": "subscribe",
        "id": 3,
        "resource": {
            "process-list": {
            }
        }
    }

    {
        "type": "subscribe",
        "id": 3,
        "resource": {
            type: "process-list",
            id: {
                //specyficzne idki dla tego modelu
            }
        }
    }


    //odpowiedzi

    z.object({
        type: z.literal('data'),
        id: z.number(),
        data: z.unknown(),            //dane dotyczące tego konkretnego modelu
    }),
    z.object({
        type: z.literal('error-message'),
        message: z.string(),
    })


    {
        "type": "subscribe",
        "id": 5,
        "resource": {
            "type": "current-time"
        }
    }
*/

const getCurrentTime = () => new Date().toString();

const currentTime = new Value<string>(getCurrentTime(), (setValue) => {

    setValue(getCurrentTime());
    console.info('start timer');

    const timer = setInterval(() => {
        setValue(getCurrentTime());
    }, 5000);

    return () => {
        console.info('stop timer');

        clearInterval(timer);
    };
});

const common = new Common();


startWebsocketApi('0.0.0.0', 9999, SocketRouterZod, (message) => {

    if (message.type === 'process-list') {

        return autorun(() => {
            const data = ProcessListModel.get(common).data;

            if (data.type === 'ready') {
                message.response(data.value);
            }

            // message.response({
            //     'a': {
            //         'ppid': '',
            //         'mem': 'd',
            //         'cpu': '',
            //         'args': ''
            //     }
            // });
        });
    }

    if (message.type === 'current-time') {
        return autorun(() => {
            message.response(currentTime.getValue());
        });
    }

    if (message.type === 'user-data') {
        return autorun(() => {

            message.response(`userid=${message.resourceId.id} currentTime=${currentTime.getValue()}`);
        })
    }

    return assertNever(message);
});


/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...
    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska
*/
