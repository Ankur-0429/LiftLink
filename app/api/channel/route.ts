import type { NextRequest } from 'next/server'
import { NextResponse } from "next/server";
import { createChannel } from "@/service/channelService";
import { channelSchema } from '@/type';


export async function POST(request: NextRequest) {
  const parsedData = channelSchema.parse(request.body);
  if (!parsedData) return NextResponse.json({}, {status: 400});
  await createChannel(parsedData);
  return NextResponse.json({}, {status: 201});
}
