import { z } from 'zod';

export type SubscriptionRouter = Record<string, { resourceId: z.ZodType<unknown>, resp: z.ZodType<unknown>}>;

export type CreateSubscriptionData<T extends SubscriptionRouter> = {
    [K in keyof T]: {
        type: K;
        resourceId: z.infer<T[K]['resourceId']>;
        response: (response: T[K]['resp'] extends z.ZodType<infer P> ? P : never) => void;
    }
}[keyof T];


