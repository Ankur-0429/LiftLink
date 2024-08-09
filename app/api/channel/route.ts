import type { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import { createChannel } from "@/service/channelService";
import { z } from "zod";

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

export async function POST(request: NextRequest) {
  const parsedData = channelSchema.parse(request.body);
  if (!parsedData) return NextResponse.json({}, {status: 400});
  await createChannel(parsedData);
  return NextResponse.json({}, {status: 201});
}
