import { AutoWeakMap, timeout, Resource, ResourceResult } from "@reactive/utils";
import type { Common } from "../Common.ts";
import { processList, type PidRecordType } from "../api/processList/processList.ts";
import { computed, makeObservable } from "mobx";


export class ProcessListModel {

    private dataResource: Resource<Record<string, PidRecordType>>;

    public static get = AutoWeakMap.create((common: Common) => new ProcessListModel(common));

    private constructor(_common: Common) {
        this.dataResource = Resource.browserAndServer<Record<string, PidRecordType>>(processList, () => {

            console.info('ProcessListModel on');
            let active: boolean = true;

            (async () => {
                while (active) {
                    await this.dataResource.refresh();
                    await timeout(5000);
                }
            })();

            return () => {
                console.info('ProcessListModel off');
                active = false;
            };
        });

        makeObservable({
            data: computed.struct
        })
    }

    get data(): ResourceResult<Record<string, PidRecordType>> {
        return this.dataResource.get();
    }
}

