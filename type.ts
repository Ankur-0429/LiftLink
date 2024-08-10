import {z} from "zod"

export const channelSchema = z.object({
  description: z.string(),
  departure: z.date(),
  from: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  to: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  ownerId: z.string(),
});

export type Channel = z.infer<typeof channelSchema>;