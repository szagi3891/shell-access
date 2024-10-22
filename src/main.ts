import { startWebsocketApi } from "./lib-socket/server.ts";
import { PidRecordZod } from "./api/processList/processList.ts";
import { z } from 'zod';
import { autorun } from "mobx";
import { assertNever } from "@reactive/utils";
import { ProcessListModel } from "./models/ProcessListModel.ts";
import { Common } from "./Common.ts";

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
*/

const common = new Common();

startWebsocketApi('0.0.0.0', 9999, aaaZod, (message) => {

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

            return () => {
                //potencjalne odłączanie czegoś mozna tutaj podpiąć
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


/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...
    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska
*/
