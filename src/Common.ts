import { AutoWeakMap, autoWeakMapKey } from "@reactive/utils";

export class Common {

    constructor() {
        AutoWeakMap.register(this);            
    }

    [autoWeakMapKey](): void {
    }
}

