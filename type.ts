import {z} from "zod"

export const channelSchema = z.object({
  description: z.string(),
  departure: z.date(),
  from: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string()
  }),
  to: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string()
  }),
  womenOnly: z.boolean(),
  ownerId: z.string(),
});

export type Status = {
  address: string;
  latitude: number;
  longitude: number;
};

export type Channel = z.infer<typeof channelSchema>;