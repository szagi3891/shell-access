import { AutoWeakMap, Resource, ResourceResult, timeout } from "@reactive/utils";
import type { Common } from "../Common.ts";
import { processList, type PidRecordType } from "../api/processList/processList.ts";


export class ProcessListModel {

    private dataResource: Resource<Record<string, PidRecordType>>;

    public static get = AutoWeakMap.create((common: Common) => new ProcessListModel(common));

    private constructor(_common: Common) {
        this.dataResource = Resource.browserAndServer<Record<string, PidRecordType>>(processList, () => {

            let active: boolean = true;

            (async () => {
                while (active) {
                    await this.dataResource.refresh();
                    await timeout(1000);
                }
            })();

            return () => {
                active = false;
            };
        });
    }

    get data(): ResourceResult<Record<string, PidRecordType>> {
        return this.dataResource.get();
    }
}

