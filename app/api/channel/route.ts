import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createChannel } from "@/service/channelService";
import { channelSchema } from "@/type";
import {z} from "zod"
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    body['ownerId'] = session?.user?.id;
    body['departure'] = new Date(body['departure']);
    const parsedData = channelSchema.parse(body);
    await createChannel(parsedData);
    return NextResponse.json({}, { status: 201 });
  } catch(error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
