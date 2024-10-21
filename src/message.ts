import { z } from 'zod';
import { PidRecordZod } from "./api/processList/processList.ts";

export const MessageBrowserZod = z.union([
    z.object({
        type: z.literal('process-list'),
        id: z.number(), //request id 
    }),
    z.object({
        type: z.literal('unsubscribe'),
        id: z.number(), //request id
    }),
]);

export type MessageBrowserType = z.TypeOf<typeof MessageBrowserZod>;

export const MessageServerZod = z.union([
    z.object({
        type: z.literal('process-list'),
        response: z.record(
            z.string(),
            PidRecordZod
        ),
    }),
    z.object({
        type: z.literal('error-message'),
        message: z.string(),
    })
]);

export type MessageServerType = z.TypeOf<typeof MessageServerZod>;
