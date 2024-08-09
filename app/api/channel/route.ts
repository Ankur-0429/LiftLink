import type { NextApiRequest, NextApiResponse } from 'next';
import { createChannel } from "@/service/channelService";
import { z } from 'zod';

export const channelSchema = z.object({
  name: z.string(),
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const parsedData = channelSchema.parse(req.body);
    if (!parsedData) return res.status(400);
    await createChannel(parsedData);
    res.status(201);
  } else {
    res.status(405).end();
  }
}
