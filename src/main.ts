import { startWebsocketApi } from "./lib-socket/server.ts";
import { PidRecordZod } from "./api/processList/processList.ts";
import { z } from 'zod';
import { autorun } from "mobx";

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




// const common = new Common();

/*
    dwa rodzaje zasobów

    obserwowanie jakiegoś parametru serwera ...
    odpalenie "taska" który będzie składał się z trzech procesów, potem obserwowanie stanu tego taska
*/

startWebsocketApi('0.0.0.0', 9999, DataIdZod, (subscribeMessage: DataIdType) => {

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

